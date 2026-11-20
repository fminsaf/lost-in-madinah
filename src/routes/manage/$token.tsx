import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Check, LoaderCircle, LockKeyhole } from "lucide-react";
import { useState } from "react";
import {
	getManagedReport,
	updateManagedReport,
} from "#/features/reports/server";

export const Route = createFileRoute("/manage/$token")({
	loader: ({ params }) => getManagedReport({ data: { token: params.token } }),
	component: ManageReportPage,
});

function ManageReportPage() {
	const report = Route.useLoaderData();
	const params = Route.useParams();
	const router = useRouter();
	const updateReport = useServerFn(updateManagedReport);
	const [message, setMessage] = useState("");
	const [busy, setBusy] = useState(false);

	async function changeStatus(status: "reunited" | "archived") {
		setBusy(true);
		setMessage("");
		try {
			await updateReport({ data: { token: params.token, status } });
			setMessage(
				status === "reunited"
					? "Marked as reunited. Thank you for letting the community know."
					: "Your report has been archived.",
			);
			void router.invalidate();
		} catch {
			setMessage("We could not update this report. Please try again.");
		} finally {
			setBusy(false);
		}
	}

	if (!report)
		return (
			<main className="not-found page-wrap">
				<p className="eyebrow">PRIVATE LINK</p>
				<h1>This management link is not valid.</h1>
				<p>
					Keep this link private. If you have lost it, the report cannot
					currently be recovered.
				</p>
				<Link to="/" className="button button-primary">
					Go to home
				</Link>
			</main>
		);

	return (
		<main className="manage-page page-wrap">
			<Link to="/" className="back-link">
				<ArrowLeft size={16} /> Home
			</Link>
			<section className="manage-shell">
				<span className="manage-lock">
					<LockKeyhole size={21} />
				</span>
				<p className="eyebrow">PRIVATE REPORT MANAGEMENT</p>
				<h1>Your report</h1>
				<p className="manage-item">{report.title}</p>
				<p className="reference-note">
					Reference <strong>{report.referenceCode}</strong> · {report.type}
				</p>
				<div className="status-current">
					Current status <strong>{report.status.replace("_", " ")}</strong>
				</div>
				{message && (
					<output className="manage-message">
						<Check size={16} />
						{message}
					</output>
				)}
				<div className="manage-actions">
					{report.status !== "reunited" && report.status !== "archived" && (
						<button
							className="button button-primary"
							type="button"
							disabled={busy}
							onClick={() => void changeStatus("reunited")}
						>
							{busy ? (
								<LoaderCircle className="spin" size={17} />
							) : (
								<Check size={17} />
							)}{" "}
							Mark as reunited
						</button>
					)}
					{report.status === "active" && (
						<button
							className="button button-outline"
							type="button"
							disabled={busy}
							onClick={() => void changeStatus("archived")}
						>
							Archive report
						</button>
					)}
				</div>
				<p className="manage-footnote">
					Anyone with this private link can manage this report. Don’t share it
					publicly.
				</p>
			</section>
		</main>
	);
}
