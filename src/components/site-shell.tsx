import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
	const [menuOpen, setMenuOpen] = useState(false);
	const links = [
		{ to: "/browse" as const, label: "Browse reports" },
		{ to: "/how-it-works" as const, label: "How it works" },
		{ to: "/about" as const, label: "About" },
	];

	return (
		<header className="site-header">
			<div className="header-inner">
				<Link to="/" className="brand" aria-label="Madinah Lost & Found home">
					<span className="brand-mark" aria-hidden="true">
						م
					</span>
					<span className="brand-text">
						Madinah<span>Lost &amp; Found</span>
					</span>
				</Link>
				<nav className="desktop-nav" aria-label="Main navigation">
					{links.map((link) => (
						<Link key={link.to} to={link.to} className="nav-item">
							{link.label}
						</Link>
					))}
				</nav>
				<Link to="/report/found" className="header-report">
					I found something <span aria-hidden="true">↗</span>
				</Link>
				<button
					type="button"
					className="menu-toggle"
					aria-label={menuOpen ? "Close menu" : "Open menu"}
					aria-expanded={menuOpen}
					onClick={() => setMenuOpen((open) => !open)}
				>
					{menuOpen ? <X size={21} /> : <Menu size={21} />}
				</button>
			</div>
			{menuOpen && (
				<nav className="mobile-nav" aria-label="Mobile navigation">
					{links.map((link) => (
						<Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
							{link.label}
						</Link>
					))}
					<Link to="/report/lost" onClick={() => setMenuOpen(false)}>
						I lost something
					</Link>
				</nav>
			)}
		</header>
	);
}

export function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="footer-inner">
				<div>
					<Link to="/" className="brand footer-brand">
						<span className="brand-mark" aria-hidden="true">
							م
						</span>
						<span className="brand-text">
							Madinah<span>Lost &amp; Found</span>
						</span>
					</Link>
					<p>
						A small community effort to bring belongings back to their owners.
					</p>
				</div>
				<div className="footer-links">
					<Link to="/browse">Browse reports</Link>
					<Link to="/how-it-works">How it works</Link>
					<Link to="/about">About this project</Link>
					<Link to="/donate">
						<Heart size={14} /> Support the project
					</Link>
				</div>
			</div>
			<div className="footer-note">
				<MapPin size={14} /> Community-run and not affiliated with any
				government body or place of worship.
			</div>
		</footer>
	);
}
