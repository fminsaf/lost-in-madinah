import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ReportForm } from "#/features/reports/report-form";

export const Route = createFileRoute("/report/found")({
	component: FoundReportPage,
});

function FoundReportPage() {
	return (
		<main className="form-page page-wrap">
			<Link to="/" className="back-link">
				<ArrowLeft size={16} /> Back to home
			</Link>
			<div className="form-heading">
				<p className="eyebrow">THANK YOU FOR LOOKING OUT</p>
				<h1>Report something found</h1>
				<p>
					Your report can make someone’s day. Keep a few identifying details
					private so the owner can verify it.
				</p>
			</div>
			<div className="form-shell">
				<div className="form-topline">
					<span className="form-step">YOUR REPORT</span>
					<span>
						<ShieldCheck size={15} /> Private by default
					</span>
				</div>
				<ReportForm type="found" />
			</div>
		</main>
	);
}
