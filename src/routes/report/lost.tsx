import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ReportForm } from "#/features/reports/report-form";

export const Route = createFileRoute("/report/lost")({
	component: LostReportPage,
});

function LostReportPage() {
	return (
		<main className="form-page page-wrap">
			<Link to="/" className="back-link">
				<ArrowLeft size={16} /> Back to home
			</Link>
			<div className="form-heading">
				<p className="eyebrow">LET’S HELP YOU FIND IT</p>
				<h1>Report something lost</h1>
				<p>
					Share a few details and we’ll look for reports that might match. It
					only takes a minute.
				</p>
			</div>
			<div className="form-shell">
				<div className="form-topline">
					<span className="form-step">YOUR REPORT</span>
					<span>
						<ShieldCheck size={15} /> Private by default
					</span>
				</div>
				<ReportForm type="lost" />
			</div>
		</main>
	);
}
