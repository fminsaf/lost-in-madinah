import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { EmptyReports, ReportCard } from "#/components/report-card";
import { reportCategories, reportTypeSchema } from "#/features/reports/schema";
import { browseReports } from "#/features/reports/server";

const browseSearchSchema = z.object({
	type: reportTypeSchema.optional(),
	category: z.string().optional(),
	search: z.string().optional(),
});

export const Route = createFileRoute("/browse")({
	validateSearch: browseSearchSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ deps }) => browseReports({ data: deps }),
	component: BrowsePage,
});

function BrowsePage() {
	const reports = Route.useLoaderData();
	const search = Route.useSearch();
	const navigate = useNavigate({ from: "/browse" });
	const [query, setQuery] = useState(search.search ?? "");

	function updateSearch(next: Partial<typeof search>) {
		void navigate({ search: (previous) => ({ ...previous, ...next }) });
	}

	return (
		<main className="browse-page page-wrap">
			<div className="browse-heading">
				<p className="eyebrow">COMMUNITY REPORTS</p>
				<h1>Let’s find what you’re looking for.</h1>
				<p>
					Search recent lost and found reports around Madinah. Contact details
					are never public.
				</p>
			</div>
			<form
				className="browse-search"
				onSubmit={(event) => {
					event.preventDefault();
					updateSearch({ search: query || undefined });
				}}
			>
				<Search size={19} />
				<input
					aria-label="Search reports"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Try “black bag” or “Quba”"
				/>
				<button type="submit" className="button button-primary">
					Search
				</button>
			</form>
			<div className="browse-controls">
				<div className="filter-label">
					<SlidersHorizontal size={16} /> Filter reports
				</div>
				<div className="filter-row">
					<label className="visually-hidden" htmlFor="type-filter">
						Report type
					</label>
					<select
						id="type-filter"
						value={search.type ?? ""}
						onChange={(event) =>
							updateSearch({
								type: event.target.value
									? reportTypeSchema.parse(event.target.value)
									: undefined,
							})
						}
					>
						<option value="">All reports</option>
						<option value="lost">Lost items</option>
						<option value="found">Found items</option>
					</select>
					<label className="visually-hidden" htmlFor="category-filter">
						Category
					</label>
					<select
						id="category-filter"
						value={search.category ?? ""}
						onChange={(event) =>
							updateSearch({ category: event.target.value || undefined })
						}
					>
						<option value="">All categories</option>
						{reportCategories.map((category) => (
							<option key={category}>{category}</option>
						))}
					</select>
					{(search.type || search.category || search.search) && (
						<button
							className="clear-filter"
							type="button"
							onClick={() => {
								setQuery("");
								void navigate({ search: {} });
							}}
						>
							Clear filters
						</button>
					)}
				</div>
			</div>
			<div className="results-heading">
				<strong>
					{reports.length ? `${reports.length} reports` : "No reports found"}
				</strong>
				<span>Showing the latest community reports</span>
			</div>
			{reports.length ? (
				<div className="report-grid">
					{reports.map((report) => (
						<ReportCard key={report._id} report={report} />
					))}
				</div>
			) : (
				<EmptyReports
					message={
						search.search
							? "No reports match that search."
							: "No reports match these filters."
					}
				/>
			)}
			<section className="browse-cta">
				<div>
					<h2>Have something to report?</h2>
					<p>It’s free, takes a moment, and may help someone today.</p>
				</div>
				<Link to="/report/lost" className="button button-primary">
					I lost something <ArrowRight size={16} />
				</Link>
				<Link to="/report/found" className="button button-outline">
					I found something <ArrowRight size={16} />
				</Link>
			</section>
		</main>
	);
}
