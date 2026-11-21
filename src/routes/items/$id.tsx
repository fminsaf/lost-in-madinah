import { createFileRoute, Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { ArrowLeft, CalendarDays, MapPin, ShieldAlert } from "lucide-react";
import { getPublicReport } from "#/features/reports/server";

export const Route = createFileRoute("/items/$id")({
	loader: ({ params }) => getPublicReport({ data: { id: params.id } }),
	component: ItemPage,
});

function ItemPage() {
	const report = Route.useLoaderData();
	if (!report)
		return (
			<main className="not-found page-wrap">
				<p className="eyebrow">REPORT NOT AVAILABLE</p>
				<h1>This report may have been closed.</h1>
				<Link to="/browse" className="button button-primary">
					Browse reports
				</Link>
			</main>
		);
	return (
		<main className="detail-page page-wrap">
			<Link to="/browse" className="back-link">
				<ArrowLeft size={16} /> Back to reports
			</Link>
			<div className="detail-layout">
				<article className="detail-main">
					<span className={`type-pill ${report.type}`}>
						{report.type === "lost" ? "Lost item" : "Found item"}
					</span>
					<p className="eyebrow">
						{report.category} · REF {report.referenceCode}
					</p>
					<h1>{report.title}</h1>
					<div className="detail-meta">
						<span>
							<MapPin size={16} />
							{report.locationName}
						</span>
						<span>
							<CalendarDays size={16} />
							{format(parseISO(report.occurredAt), "MMMM d, yyyy")}
						</span>
					</div>
					<div className="detail-description">
						<h2>About this item</h2>
						<p>{report.description}</p>
					</div>
					{(report.color || report.brand) && (
						<div className="detail-facts">
							{report.color && (
								<div>
									<span>Color</span>
									<strong>{report.color}</strong>
								</div>
							)}
							{report.brand && (
								<div>
									<span>Brand</span>
									<strong>{report.brand}</strong>
								</div>
							)}
						</div>
					)}
					<div className="safety-notice">
						<ShieldAlert size={19} />
						<p>
							Some identifying details may be intentionally private. Never send
							money or sensitive personal information to verify ownership.
						</p>
					</div>
				</article>
				<aside className="detail-aside">
					<p className="eyebrow">CAN YOU HELP?</p>
					<h2>
						{report.type === "found"
							? "Does this belong to you?"
							: "Have you seen this?"}
					</h2>
					<p>
						Contact details are kept private. The secure contact feature is not
						available yet; please do not post personal details publicly.
					</p>
					<Link
						to={`/report/${report.type === "found" ? "lost" : "found"}`}
						className="button button-primary"
					>
						{report.type === "found"
							? "I think it’s mine"
							: "I found something similar"}
					</Link>
					<p className="reference-note">
						Include reference <strong>{report.referenceCode}</strong> if you
						share this report with someone.
					</p>
				</aside>
			</div>
		</main>
	);
}
