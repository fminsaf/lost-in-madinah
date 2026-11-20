import type { ReportInput } from "../reports/schema";

type MatchableReport = Omit<
	Pick<
		ReportInput,
		| "type"
		| "title"
		| "description"
		| "category"
		| "brand"
		| "color"
		| "characteristics"
		| "locationName"
		| "occurredAt"
	>,
	"occurredAt"
> & {
	occurredAt: Date | string;
};

export type MatchResult = {
	score: number;
	reasons: string[];
};

function normalize(value: string | undefined) {
	return (value ?? "")
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[^\p{L}\p{N}\s]/gu, " ")
		.split(/\s+/)
		.filter((word) => word.length > 2);
}

function textSimilarity(left: string, right: string) {
	const leftWords = new Set(normalize(left));
	const rightWords = new Set(normalize(right));
	if (!leftWords.size || !rightWords.size) return 0;
	const intersection = [...leftWords].filter((word) =>
		rightWords.has(word),
	).length;
	return (2 * intersection) / (leftWords.size + rightWords.size);
}

export const defaultMatchWeights = {
	category: 0.2,
	description: 0.25,
	brand: 0.1,
	color: 0.1,
	location: 0.2,
	date: 0.15,
} as const;

type MatchWeights = typeof defaultMatchWeights;

export function scoreMatch(
	left: MatchableReport,
	right: MatchableReport,
	weights: MatchWeights = defaultMatchWeights,
): MatchResult {
	if (left.type === right.type) return { score: 0, reasons: [] };

	const itemText = (report: MatchableReport) =>
		[report.title, report.description, report.characteristics]
			.filter(Boolean)
			.join(" ");
	const category = left.category === right.category ? 1 : 0;
	const description = textSimilarity(itemText(left), itemText(right));
	const brand =
		left.brand && right.brand ? textSimilarity(left.brand, right.brand) : 0;
	const color =
		left.color && right.color ? textSimilarity(left.color, right.color) : 0;
	const location = textSimilarity(left.locationName, right.locationName);
	const daysApart =
		Math.abs(
			new Date(left.occurredAt).getTime() -
				new Date(right.occurredAt).getTime(),
		) / 86_400_000;
	const date = Math.max(0, 1 - daysApart / 30);

	const score =
		category * weights.category +
		description * weights.description +
		brand * weights.brand +
		color * weights.color +
		location * weights.location +
		date * weights.date;

	const reasons = [
		category ? "Same item category" : "",
		description >= 0.2 ? "Similar item descriptions" : "",
		brand > 0 ? "Brand details are similar" : "",
		color > 0 ? "Color details are similar" : "",
		location > 0.2 ? "Reported in a similar area" : "",
		date >= 0.5 ? "Reported around a similar date" : "",
	].filter(Boolean);

	return { score: Math.round(score * 100), reasons };
}
