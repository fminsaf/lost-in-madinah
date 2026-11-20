import { Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import {
	BriefcaseBusiness,
	CalendarDays,
	Camera,
	FileText,
	KeyRound,
	MapPin,
	Smartphone,
} from "lucide-react";
import type { PublicReport } from "#/features/reports/schema";

const categoryIcons: Record<string, typeof BriefcaseBusiness> = {
	Bags: BriefcaseBusiness,
	Documents: FileText,
	Electronics: Smartphone,
	Keys: KeyRound,
};

export function ReportCard({ report }: { report: PublicReport }) {
	const Icon = categoryIcons[report.category] ?? Camera;
	return (
		<Link to="/items/$id" params={{ id: report._id }} className="report-card">
			<div className={`report-art ${report.type}`}>
				<Icon size={34} strokeWidth={1.4} aria-hidden="true" />
				<span className={`type-pill ${report.type}`}>
					{report.type === "lost" ? "Lost" : "Found"}
				</span>
			</div>
			<div className="report-card-body">
				<div className="report-card-category">{report.category}</div>
				<h3>{report.title}</h3>
				<div className="report-card-meta">
					<span>
						<MapPin size={14} />
						{report.locationName}
					</span>
					<span>
						<CalendarDays size={14} />
						{format(parseISO(report.occurredAt), "MMM d")}
					</span>
				</div>
			</div>
		</Link>
	);
}

export function EmptyReports({
	message = "No reports here yet.",
}: {
	message?: string;
}) {
	return (
		<div className="empty-reports">
			<span className="empty-mark">م</span>
			<p>{message}</p>
			<span>New reports from the community will appear here.</span>
		</div>
	);
}
