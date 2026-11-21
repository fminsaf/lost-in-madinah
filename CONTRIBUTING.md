# Contributing

Thank you for helping make this community service safer and more useful.

## Before you start

- Keep ordinary reporting and browsing free and accountless.
- Do not add public exposure of reporter contact details, exact valuable-item locations, or sensitive identifying details.
- Do not imply an official partnership unless one exists.
- For larger changes, open an issue to discuss the approach before implementation.

## Development

1. Install Node.js 22+, pnpm, and MongoDB.
2. Copy `.env.example` to `.env` and configure `MONGODB_URI`.
3. Install dependencies with `pnpm install`.
4. Run `pnpm dev`.
5. Before opening a pull request, run `pnpm exec tsc --noEmit`, `pnpm build`, and `pnpm check`.

Use focused changes, accessible semantic markup, server-side Zod validation, and tests for new critical behavior. Never include secrets, real personal data, or production database records in changes or test fixtures.

## Pull requests

Describe the user impact, privacy implications, and how the change was checked. Call out any feature that requires additional deployment configuration or is not yet production-ready.
