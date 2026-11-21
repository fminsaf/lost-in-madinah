import { describe, expect, it } from "vitest";
import { publicReportSchema, reportInputSchema } from "../reports/schema";
import { scoreMatch } from "./score";

const lostReport = {
	type: "lost" as const,
	title: "Black backpack",
	description: "Small black backpack with a green fabric tag.",
	category: "Bags" as const,
	brand: "Northwind",
	color: "Black",
	characteristics: "A stitched green tag near the inside pocket",
	locationName: "Quba",
	occurredAt: "2026-11-18",
};

describe("scoreMatch", () => {
	it("ranks reports with matching details and explains the overlap", () => {
		const result = scoreMatch(lostReport, {
			...lostReport,
			type: "found",
			title: "Black backpack found",
			description: "A small black backpack with green fabric tag.",
			occurredAt: new Date("2026-11-19"),
		});

		expect(result.score).toBeGreaterThanOrEqual(70);
		expect(result.reasons).toContain("Same item category");
		expect(result.reasons).toContain("Similar item descriptions");
	});

	it("does not match reports of the same type", () => {
		expect(scoreMatch(lostReport, lostReport)).toEqual({
			score: 0,
			reasons: [],
		});
	});
});

describe("report privacy validation", () => {
	it("rejects contact details and long identifying numbers in public text", () => {
		const result = reportInputSchema.safeParse({
			...lostReport,
			description: "Call me at +966 555 123 4567 about this bag.",
			email: "owner@example.com",
		});

		expect(result.success).toBe(false);
	});

	it("does not include private characteristics in public report output", () => {
		const result = publicReportSchema.parse({
			_id: "507f1f77bcf86cd799439011",
			referenceCode: "MDN-ABC12345",
			type: "found",
			title: "Black backpack",
			description: "A black bag was found.",
			category: "Bags",
			locationName: "Quba",
			occurredAt: "2026-11-19T00:00:00.000Z",
			createdAt: "2026-11-19T00:00:00.000Z",
			status: "active",
			characteristics: "Hidden identifying detail",
		});

		expect(result).not.toHaveProperty("characteristics");
	});
});
