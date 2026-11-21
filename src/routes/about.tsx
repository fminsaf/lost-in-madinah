import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, Sprout } from "lucide-react";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
	return (
		<main className="info-page page-wrap">
			<header className="info-heading">
				<p className="eyebrow">A COMMUNITY-POWERED PROJECT</p>
				<h1>
					Looking out for
					<br />
					<em>one another.</em>
				</h1>
				<p>
					Madinah Lost &amp; Found is a free, open-source community service
					built to help people reconnect with the things they’ve misplaced.
				</p>
			</header>
			<section className="about-values">
				<article>
					<HeartHandshake size={23} />
					<h2>Made to help</h2>
					<p>
						Our goal is successful reunions, not more time spent online. Anyone
						can report or browse without signing up.
					</p>
				</article>
				<article>
					<Sprout size={23} />
					<h2>Open by design</h2>
					<p>
						The project is community-built and intended to be adapted for other
						cities. Contributions that improve safety and accessibility are
						welcome.
					</p>
				</article>
			</section>
			<section className="info-callout">
				<span className="about-symbol">م</span>
				<div>
					<h2>Independent and community-run</h2>
					<p>
						This project is not affiliated with the government of Saudi Arabia,
						any mosque, hotel, transport provider, or other authority. For
						passports, bank cards, phones, and official documents, contact an
						authorized lost-property channel where applicable.
					</p>
				</div>
			</section>
			<section className="info-bottom">
				<h2>Want to contribute?</h2>
				<p>
					Help us make this service more useful, trustworthy, and welcoming.
				</p>
				<Link to="/donate" className="button button-primary">
					Support the project <ArrowRight size={16} />
				</Link>
			</section>
		</main>
	);
}
