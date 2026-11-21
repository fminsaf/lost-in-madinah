import mongoose, { type Model, Schema } from "mongoose";
import {
	reportCategories,
	reportStatusSchema,
	reportTypeSchema,
} from "./schema";

type ReportFields = {
	referenceCode: string;
	type: "lost" | "found";
	title: string;
	description: string;
	category: (typeof reportCategories)[number];
	brand?: string;
	color?: string;
	characteristics?: string;
	locationName: string;
	occurredAt: Date;
	status:
		| "active"
		| "potential_match"
		| "reunited"
		| "archived"
		| "under_review"
		| "removed";
	contact?: { email?: string; phone?: string };
	managementTokenHash: string;
	managementTokenExpiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
};

type MatchFields = {
	lostReportId: mongoose.Types.ObjectId;
	foundReportId: mongoose.Types.ObjectId;
	score: number;
	reasons: string[];
	status: "suggested" | "confirmed" | "dismissed";
	createdAt: Date;
	updatedAt: Date;
};

const ReportSchema = new Schema<ReportFields>(
	{
		referenceCode: { type: String, required: true, unique: true, index: true },
		type: { type: String, enum: reportTypeSchema.options, required: true },
		title: { type: String, required: true, maxlength: 100 },
		description: { type: String, required: true, maxlength: 1200 },
		category: { type: String, enum: reportCategories, required: true },
		brand: { type: String, maxlength: 80 },
		color: { type: String, maxlength: 60 },
		characteristics: { type: String, maxlength: 500, select: false },
		locationName: { type: String, required: true, maxlength: 120 },
		occurredAt: { type: Date, required: true },
		status: {
			type: String,
			enum: reportStatusSchema.options,
			default: "active",
			index: true,
		},
		contact: {
			email: { type: String, select: false },
			phone: { type: String, select: false },
		},
		managementTokenHash: { type: String, required: true, select: false },
		managementTokenExpiresAt: { type: Date, required: true, select: false },
	},
	{ timestamps: true },
);

ReportSchema.index({
	title: "text",
	description: "text",
	category: "text",
	locationName: "text",
});
ReportSchema.index({ type: 1, status: 1, createdAt: -1 });
ReportSchema.index({ category: 1, status: 1 });

const MatchSchema = new Schema<MatchFields>(
	{
		lostReportId: {
			type: Schema.Types.ObjectId,
			ref: "Report",
			required: true,
		},
		foundReportId: {
			type: Schema.Types.ObjectId,
			ref: "Report",
			required: true,
		},
		score: { type: Number, min: 0, max: 100, required: true },
		reasons: { type: [String], default: [] },
		status: {
			type: String,
			enum: ["suggested", "confirmed", "dismissed"],
			default: "suggested",
		},
	},
	{ timestamps: true },
);

MatchSchema.index({ lostReportId: 1, foundReportId: 1 }, { unique: true });

export const Report: Model<ReportFields> =
	(mongoose.models.Report as Model<ReportFields> | undefined) ??
	mongoose.model<ReportFields>("Report", ReportSchema);
export const Match: Model<MatchFields> =
	(mongoose.models.Match as Model<MatchFields> | undefined) ??
	mongoose.model<MatchFields>("Match", MatchSchema);
