import { z } from "zod";

export const reportTypeSchema = z.enum(["lost", "found"]);

export const reportStatusSchema = z.enum([
	"active",
	"potential_match",
	"reunited",
	"archived",
	"under_review",
	"removed",
]);

export const reportCategories = [
	"Bags",
	"Clothing",
	"Documents",
	"Electronics",
	"Jewelry",
	"Keys",
	"Personal items",
	"Other",
] as const;

export const reportInputSchema = z
	.object({
		type: reportTypeSchema,
		title: z.string().trim().min(3).max(100),
		description: z.string().trim().min(10).max(1200),
		category: z.enum(reportCategories),
		brand: z.string().trim().max(80).optional(),
		color: z.string().trim().max(60).optional(),
		characteristics: z.string().trim().max(500).optional(),
		locationName: z.string().trim().min(2).max(120),
		occurredAt: z.iso
			.date()
			.refine((value) => value <= new Date().toISOString().slice(0, 10), {
				message: "Date must be today or earlier.",
			}),
		email: z.email().optional().or(z.literal("")),
		phone: z.string().trim().max(30).optional().or(z.literal("")),
	})
	.refine((value) => Boolean(value.email || value.phone), {
		message:
			"Add an email address or phone number so the other person can reach you privately.",
		path: ["email"],
	})
	.refine(
		(value) => {
			const text = [value.title, value.description, value.brand, value.color]
				.filter(Boolean)
				.join(" ");
			return (
				!/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text) &&
				!/\+?\d[\d\s().-]{7,}\d/.test(text) &&
				!/\b\d(?:[\s-]*\d){7,}\b/.test(text)
			);
		},
		{
			message:
				"Remove contact details and long identifying numbers from the public item description.",
			path: ["description"],
		},
	);

export const publicReportSchema = z.object({
	_id: z.string(),
	referenceCode: z.string(),
	type: reportTypeSchema,
	title: z.string(),
	description: z.string(),
	category: z.string(),
	brand: z.string().optional(),
	color: z.string().optional(),
	locationName: z.string(),
	occurredAt: z.string(),
	createdAt: z.string(),
	status: reportStatusSchema,
});

export type ReportInput = z.infer<typeof reportInputSchema>;
export type PublicReport = z.infer<typeof publicReportSchema>;
