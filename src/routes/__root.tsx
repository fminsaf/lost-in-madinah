import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "#/components/site-shell";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	errorComponent: ({ reset }) => (
		<main className="not-found page-wrap">
			<p className="eyebrow">TEMPORARY ERROR</p>
			<h1>We couldn’t load this page.</h1>
			<p>Please try again. Your private information has not been displayed.</p>
			<button className="button button-primary" type="button" onClick={reset}>
				Try again
			</button>
		</main>
	),
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Madinah Lost & Found — Reunite with what matters",
			},
			{
				name: "description",
				content:
					"A free, community-run lost and found service for Madinah. Report a lost item, share something you found, and help bring belongings home.",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<SiteHeader />
				{children}
				<SiteFooter />
				<Scripts />
			</body>
		</html>
	);
}
