import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowDownRight,
	ArrowRight,
	BadgeCheck,
	HeartHandshake,
	Search,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import { EmptyReports, ReportCard } from "#/components/report-card";
import { browseReports, getCommunityStats } from "#/features/reports/server";

export const Route = createFileRoute("/")({
	loader: async () => {
		const [foundResult, lostResult, statsResult] = await Promise.allSettled([
			browseReports({ data: { type: "found" } }),
			browseReports({ data: { type: "lost" } }),
			getCommunityStats(),
		]);
		return {
			found:
				foundResult.status === "fulfilled"
					? foundResult.value.slice(0, 3)
					: null,
			lost:
				lostResult.status === "fulfilled" ? lostResult.value.slice(0, 3) : null,
			stats: statsResult.status === "fulfilled" ? statsResult.value : null,
		};
	},
	component: HomePage,
});

function HomePage() {
	const { found, lost, stats } = Route.useLoaderData();
	return (
		<main>
			<section className="hero page-wrap">
				<div className="hero-copy">
					<div className="location-label">
						<span className="location-dot" /> MADE FOR MADINAH
					</div>
					<h1>
						Lost something
						<br />
						in <em>Madinah?</em>
					</h1>
					<p>
						Helping people find their belongings and reunite them with their
						owners. A little kindness can go a long way.
					</p>
					<div className="hero-actions">
						<Link to="/report/lost" className="button button-primary">
							I lost something <ArrowRight size={17} />
						</Link>
						<Link to="/report/found" className="button button-light">
							I found something <ArrowDownRight size={17} />
						</Link>
					</div>
					<div className="hero-trust">
						<ShieldCheck size={16} /> Free to use · No account needed · Your
						contact stays private
					</div>
				</div>
				<figure
					className="hero-art"
					aria-label="Illustration of a found belongings notice"
				>
					<div className="art-sun" />
					<div className="art-arch">
						<div className="art-arch-inner">
							<span className="art-star">✳</span>
							<div className="art-card">
								<span className="art-card-label">FOUND IN MADINAH</span>
								<span className="art-bag">⌑</span>
								<span className="art-card-line" />
								<span className="art-card-small">Let’s get it home.</span>
							</div>
							<span className="art-leaf leaf-one" />
							<span className="art-leaf leaf-two" />
						</div>
					</div>
					<span className="art-caption">
						A community that looks out for one another.
					</span>
				</figure>
			</section>

			<nav className="quick-links page-wrap" aria-label="Quick actions">
				<Link to="/browse" className="quick-link">
					<span className="quick-icon">
						<Search size={20} />
					</span>
					<span>
						<strong>Browse reports</strong>
						<small>See what’s been found</small>
					</span>
					<ArrowRight size={17} />
				</Link>
				<Link to="/how-it-works" className="quick-link">
					<span className="quick-icon">
						<Sparkles size={20} />
					</span>
					<span>
						<strong>How it works</strong>
						<small>Simple, safe, and free</small>
					</span>
					<ArrowRight size={17} />
				</Link>
			</nav>

			<section className="report-section page-wrap">
				<div className="section-heading">
					<div>
						<p className="eyebrow">RECENTLY FOUND</p>
						<h2>Someone found these</h2>
					</div>
					<Link to="/browse" search={{ type: "found" }} className="text-link">
						See all found items <ArrowRight size={15} />
					</Link>
				</div>
				{found === null ? (
					<EmptyReports message="Reports are temporarily unavailable." />
				) : found.length ? (
					<div className="report-grid">
						{found.map((report) => (
							<ReportCard key={report._id} report={report} />
						))}
					</div>
				) : (
					<EmptyReports message="No found items reported yet." />
				)}
			</section>

			<section className="lost-section">
				<div className="page-wrap report-section">
					<div className="section-heading">
						<div>
							<p className="eyebrow">RECENTLY REPORTED LOST</p>
							<h2>Help bring it back</h2>
						</div>
						<Link to="/browse" search={{ type: "lost" }} className="text-link">
							See all lost items <ArrowRight size={15} />
						</Link>
					</div>
					{lost === null ? (
						<EmptyReports message="Reports are temporarily unavailable." />
					) : lost.length ? (
						<div className="report-grid">
							{lost.map((report) => (
								<ReportCard key={report._id} report={report} />
							))}
						</div>
					) : (
						<EmptyReports message="No lost items reported yet." />
					)}
				</div>
			</section>

			<section className="how-section page-wrap">
				<div className="how-intro">
					<p className="eyebrow">A LITTLE HELP GOES A LONG WAY</p>
					<h2>
						Three steps.
						<br />
						One less worry.
					</h2>
					<p>
						No signup, no fees, no complicated process. Just a thoughtful
						community helping each other.
					</p>
					<Link to="/how-it-works" className="text-link">
						More about the process <ArrowRight size={15} />
					</Link>
				</div>
				<div className="step-list">
					<div className="step">
						<span>01</span>
						<div>
							<h3>Share a report</h3>
							<p>
								Tell us what went missing or what you found. A few useful
								details are enough.
							</p>
						</div>
						<BadgeCheck size={22} />
					</div>
					<div className="step">
						<span>02</span>
						<div>
							<h3>Look for a match</h3>
							<p>
								We compare reports and show possible matches. You decide if
								something looks right.
							</p>
						</div>
						<Search size={22} />
					</div>
					<div className="step">
						<span>03</span>
						<div>
							<h3>Reconnect safely</h3>
							<p>
								Keep contact details private, and choose a safe, appropriate way
								to reunite.
							</p>
						</div>
						<HeartHandshake size={22} />
					</div>
				</div>
			</section>

			<section className="impact-section">
				<div className="page-wrap impact-inner">
					<div>
						<p className="eyebrow">GOOD THINGS HAPPEN TOGETHER</p>
						<h2>Every report is a little hope.</h2>
						<p>These numbers reflect reports shared by our community.</p>
					</div>
					{stats ? (
						<div className="impact-stats">
							<div>
								<strong>{stats.reported.toLocaleString()}</strong>
								<span>items reported</span>
							</div>
							<div>
								<strong>{stats.matches.toLocaleString()}</strong>
								<span>possible matches</span>
							</div>
							<div>
								<strong>{stats.reunited.toLocaleString()}</strong>
								<span>items reunited</span>
							</div>
						</div>
					) : (
						<p className="stats-unavailable">
							Community numbers are temporarily unavailable.
						</p>
					)}
				</div>
			</section>

			<section className="donation-strip page-wrap">
				<div className="donation-icon">
					<HeartHandshake size={23} />
				</div>
				<div>
					<h3>Free to use, community supported.</h3>
					<p>
						Optional contributions help keep this service running for everyone.
					</p>
				</div>
				<Link to="/donate" className="button button-outline">
					Support the project <ArrowRight size={16} />
				</Link>
			</section>
		</main>
	);
}
