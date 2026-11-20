import { createHash, randomBytes } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { scoreMatch } from "#/features/matching/score";
import { connectToDatabase } from "#/lib/mongodb";
import { Match, Report } from "./model";
import {
	publicReportSchema,
	reportInputSchema,
	reportTypeSchema,
} from "./schema";

export type CreateReportResult = {
	referenceCode: string;
	managementUrl: string;
	matches: {
		id: string;
		title: string;
		type: "lost" | "found";
		locationName: string;
		occurredAt: string;
		score: number;
		reasons: string[];
	}[];
};

const browseInputSchema = z.object({
	type: reportTypeSchema.optional(),
	category: z.string().optional(),
	search: z.string().trim().max(100).optional(),
});

const managementInputSchema = z.object({
	token: z.string().min(40).max(100),
	status: z.enum(["active", "reunited", "archived"]),
});

function hashToken(token: string) {
	return createHash("sha256").update(token).digest("hex");
}

function toPublicReport(report: {
	_id: { toString(): string };
	referenceCode: string;
	type: "lost" | "found";
	title: string;
	description: string;
	category: string;
	brand?: string;
	color?: string;
	locationName: string;
	occurredAt: Date;
	createdAt: Date;
	status:
		| "active"
		| "potential_match"
		| "reunited"
		| "archived"
		| "under_review"
		| "removed";
}) {
	return publicReportSchema.parse({
		_id: report._id.toString(),
		referenceCode: report.referenceCode,
		type: report.type,
		title: report.title,
		description: report.description,
		category: report.category,
		brand: report.brand,
		color: report.color,
		locationName: report.locationName,
		occurredAt: report.occurredAt.toISOString(),
		createdAt: report.createdAt.toISOString(),
		status: report.status,
	});
}

export const browseReports = createServerFn({ method: "GET" })
	.validator(browseInputSchema)
	.handler(async ({ data }) => {
		await connectToDatabase();
		const filter: Record<string, unknown> = {
			status: { $in: ["active", "potential_match"] },
		};
		if (data.type) filter.type = data.type;
		if (data.category) filter.category = data.category;
		if (data.search) {
			const escaped = data.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			filter.$or = [
				{ title: { $regex: escaped, $options: "i" } },
				{ description: { $regex: escaped, $options: "i" } },
				{ locationName: { $regex: escaped, $options: "i" } },
			];
		}
		const reports = await Report.find(filter)
			.sort({ createdAt: -1 })
			.limit(40)
			.select("-contact -managementTokenHash")
			.lean();
		return reports.map(toPublicReport);
	});

export const getPublicReport = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }))
	.handler(async ({ data }) => {
		await connectToDatabase();
		const report = await Report.findOne({
			_id: data.id,
			status: { $in: ["active", "potential_match", "reunited"] },
		})
			.select("-contact -managementTokenHash")
			.lean();
		return report ? toPublicReport(report) : null;
	});

export const getCommunityStats = createServerFn({ method: "GET" }).handler(
	async () => {
		await connectToDatabase();
		const [reported, matches, reunited] = await Promise.all([
			Report.countDocuments({ status: { $ne: "removed" } }),
			Match.countDocuments({ status: "suggested" }),
			Report.countDocuments({ status: "reunited" }),
		]);
		return { reported, matches, reunited };
	},
);

export const createReport = createServerFn({ method: "POST" })
	.validator(reportInputSchema)
	.handler(async ({ data }): Promise<CreateReportResult> => {
		await connectToDatabase();
		const token = randomBytes(32).toString("base64url");
		const referenceCode = `MDN-${randomBytes(4).toString("hex").toUpperCase()}`;
		const { email, phone, ...publicData } = data;
		const report = await Report.create({
			...publicData,
			occurredAt: new Date(publicData.occurredAt),
			referenceCode,
			status: "active",
			contact: {
				email: email || undefined,
				phone: phone || undefined,
			},
			managementTokenHash: hashToken(token),
			managementTokenExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
		});

		const candidates = await Report.find({
			type: data.type === "lost" ? "found" : "lost",
			status: { $in: ["active", "potential_match"] },
		})
			.sort({ createdAt: -1 })
			.limit(100)
			.select(
				"type title description category brand color locationName occurredAt +characteristics",
			)
			.lean();

		const matches = [];
		for (const candidate of candidates) {
			const scored = scoreMatch(data, {
				type: candidate.type,
				title: candidate.title,
				description: candidate.description,
				category: candidate.category,
				brand: candidate.brand,
				color: candidate.color,
				characteristics: candidate.characteristics,
				locationName: candidate.locationName,
				occurredAt: candidate.occurredAt,
			});
			if (scored.score < 20) continue;
			const lostReportId = data.type === "lost" ? report._id : candidate._id;
			const foundReportId = data.type === "found" ? report._id : candidate._id;
			await Match.updateOne(
				{ lostReportId, foundReportId },
				{
					$set: {
						score: scored.score,
						reasons: scored.reasons,
						status: "suggested",
					},
				},
				{ upsert: true },
			);
			matches.push({
				id: candidate._id.toString(),
				title: candidate.title,
				type: candidate.type,
				locationName: candidate.locationName,
				occurredAt: candidate.occurredAt.toISOString(),
				score: scored.score,
				reasons: scored.reasons,
			});
		}

		return {
			referenceCode: report.referenceCode,
			managementUrl: `/manage/${token}`,
			matches: matches.sort((a, b) => b.score - a.score).slice(0, 10),
		};
	});

export const updateManagedReport = createServerFn({ method: "POST" })
	.validator(managementInputSchema)
	.handler(async ({ data }) => {
		await connectToDatabase();
		const report = await Report.findOneAndUpdate(
			{
				managementTokenHash: hashToken(data.token),
				managementTokenExpiresAt: { $gt: new Date() },
			},
			{ $set: { status: data.status } },
			{ new: true },
		).select("referenceCode status");
		if (!report)
			throw new Error(
				"This private management link is invalid or has expired.",
			);
		if (data.status !== "active") {
			await Match.updateMany(
				{ $or: [{ lostReportId: report._id }, { foundReportId: report._id }] },
				{ $set: { status: "dismissed" } },
			);
		}
		return { referenceCode: report.referenceCode, status: report.status };
	});

export const getManagedReport = createServerFn({ method: "GET" })
	.validator(z.object({ token: z.string().min(40).max(100) }))
	.handler(async ({ data }) => {
		await connectToDatabase();
		const report = await Report.findOne({
			managementTokenHash: hashToken(data.token),
			managementTokenExpiresAt: { $gt: new Date() },
		})
			.select("referenceCode type title status createdAt")
			.lean();
		return report
			? {
					referenceCode: report.referenceCode,
					type: report.type,
					title: report.title,
					status: report.status,
					createdAt: report.createdAt.toISOString(),
				}
			: null;
	});
