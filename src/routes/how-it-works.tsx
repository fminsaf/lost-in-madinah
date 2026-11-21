import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	EyeOff,
	HeartHandshake,
	Search,
	ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
	component: HowItWorksPage,
});

function HowItWorksPage() {
	return (
		<main className="info-page page-wrap">
			<header className="info-heading">
				<p className="eyebrow">STRAIGHTFORWARD AND SAFE</p>
				<h1>
					Small details.
					<br />
					<em>Big relief.</em>
				</h1>
				<p>
					We make it easier for people in Madinah to help one another find lost
					belongings.
				</p>
			</header>
			<section className="info-steps">
				<article>
					<span>01</span>
					<HeartHandshake />
					<h2>Share what happened</h2>
					<p>
						Report an item lost or found without creating an account. Add an
						approximate area and a few useful details.
					</p>
				</article>
				<article>
					<span>02</span>
					<Search />
					<h2>Look for a match</h2>
					<p>
						We compare reports by type, description, area, and date. Suggestions
						are never proof of ownership.
					</p>
				</article>
				<article>
					<span>03</span>
					<ShieldCheck />
					<h2>Reconnect carefully</h2>
					<p>
						Keep unique identifying details private. Agree on a safe handover
						and use authorized channels for sensitive valuables.
					</p>
				</article>
			</section>
			<section className="info-callout">
				<EyeOff size={23} />
				<div>
					<h2>Your privacy matters</h2>
					<p>
						Contact details are private and are never shown on public reports.
						Don’t publish passport or card numbers, unlock codes, full
						identity-document details, or the exact location of a valuable item.
					</p>
				</div>
			</section>
			<section className="info-bottom">
				<h2>Ready to make a report?</h2>
				<p>It’s free, and every report can make a difference.</p>
				<div className="hero-actions">
					<Link to="/report/lost" className="button button-primary">
						I lost something <ArrowRight size={16} />
					</Link>
					<Link to="/report/found" className="button button-outline">
						I found something <ArrowRight size={16} />
					</Link>
				</div>
			</section>
		</main>
	);
}
