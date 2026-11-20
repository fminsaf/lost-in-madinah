import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/donate")({ component: DonatePage });

function DonatePage() {
	const donationUrl = import.meta.env.VITE_DONATION_URL;
	const safeDonationUrl =
		donationUrl && /^https:\/\/[^ ]+$/i.test(donationUrl)
			? donationUrl
			: undefined;
	return (
		<main className="donate-page page-wrap">
			<Link to="/" className="back-link">
				<ArrowLeft size={16} /> Back to home
			</Link>
			<section className="donate-card">
				<span className="donate-heart">
					<Heart size={25} />
				</span>
				<p className="eyebrow">OPTIONAL · ALWAYS FREE TO USE</p>
				<h1>Help keep good things going.</h1>
				<p>
					Madinah Lost &amp; Found is free for everyone. If you choose, a
					voluntary contribution can help cover hosting and keep this community
					service available.
				</p>
				<div className="donate-promise">
					<ShieldCheck size={19} />
					<span>
						Donations never unlock features. Reporting, browsing, and getting
						help stay free.
					</span>
				</div>
				{safeDonationUrl ? (
					<a
						href={safeDonationUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="button button-primary"
					>
						Continue to donation page <Heart size={16} />
					</a>
				) : (
					<p className="donation-unconfigured">
						No donation link is configured yet. You can still help by sharing
						the service or contributing to the open-source project.
					</p>
				)}
			</section>
		</main>
	);
}
