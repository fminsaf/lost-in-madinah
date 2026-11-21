# Madinah Lost & Found

A free, community-run lost-and-found service for Madinah. The project is designed to help people report an item without creating an account, browse public reports, and manage their own report through a private link.

This repository contains the first working application foundation. It is not affiliated with the government of Saudi Arabia, any mosque, hotel, transport provider, or other authority.

## What works today

- Responsive homepage, help, about, and optional donation pages.
- Accountless lost and found report submission with server-side Zod validation.
- MongoDB-backed report listings with keyword, type, and category filters.
- Public report details that omit contact details and management credentials.
- Private management links with cryptographically random tokens, SHA-256 token hashes, and a 90-day expiry. Reporters can mark reports reunited or archive them.
- Deterministic, configurable-in-code lost/found matching based on category, text, brand, color, location name, and date. Suggestions are never proof of ownership.
- Community counts calculated from MongoDB, with explicit unavailable states if the database is not configured.
- Safety guidance for personal information and sensitive valuables.

## Not implemented yet

This MVP deliberately does not pretend to provide features that are not wired up. Image storage, map selection/coordinate handling, private contact requests and email delivery, abuse reports, rate limiting, CAPTCHA, administrator authentication/moderation, multilingual/RTL dictionaries, broader unit coverage, and Playwright coverage remain follow-up work. The detail page explains that secure contact is not yet available. Do not deploy this as a complete production lost-property service until those safeguards and operational controls are added.

## Stack

- TanStack Start and TanStack Router
- TypeScript, React, Tailwind CSS
- MongoDB and Mongoose
- Zod, React Hook Form
- Lucide React, date-fns
- pnpm

## Run locally

Requirements: Node.js 22 or later, pnpm, and a MongoDB instance.

```sh
pnpm install
cp .env.example .env
# Set MONGODB_URI to a local or hosted MongoDB connection string.
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Reports and statistics require a reachable MongoDB instance. Never commit `.env` or production credentials.

## Checks

```sh
pnpm exec tsc --noEmit
pnpm build
pnpm test
pnpm check
```

The starter's full `pnpm check` currently reports formatting/configuration issues in the pre-existing `.vscode/settings.json`, `biome.json`, and `vite.config.ts`. The changed application source can be checked independently with `pnpm exec biome check src/components src/features src/routes src/lib/mongodb.ts src/env.ts vitest.config.ts`.

## Project layout

- `src/features/reports/` — Zod validation, Mongoose models, server functions, reporting form.
- `src/features/matching/` — deterministic matching score and explanations.
- `src/components/` — site navigation and public report cards.
- `src/routes/` — TanStack file routes.
- `src/lib/mongodb.ts` — cached server-side MongoDB connection.

## Privacy and safety

Public report queries explicitly omit the private contact and token-hash fields. Management tokens are random, stored only as SHA-256 hashes, and expire after 90 days. Treat the management URL like a password. Do not publish document numbers, bank-card details, unlock codes, full identity-document information, exact coordinates, or details that could enable fraudulent ownership claims. For passports, bank cards, phones, and official documents, use an authorized lost-property channel where applicable.

## Roadmap

1. Harden the foundation: persistent rate limiting, deployment headers, monitoring, and database migrations/index review.
2. Add configurable image storage and approximate map/location support.
3. Implement secure, rate-limited contact requests and optional email notifications.
4. Add abuse reporting, protected administrator review, and audit logs.
5. Add translation dictionaries and RTL support, then unit and Playwright coverage.

Contributions are welcome; see [CONTRIBUTING.md](./CONTRIBUTING.md) and [SECURITY.md](./SECURITY.md).
