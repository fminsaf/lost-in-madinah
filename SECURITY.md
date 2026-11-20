# Security Policy

## Reporting a vulnerability

Please do not report security vulnerabilities in public issues. Use GitHub's private vulnerability reporting for this repository, if enabled, or contact the maintainers privately through GitHub.

Include the affected component, impact, reproduction conditions, and any suggested mitigation. Do not include real user data, credentials, or public exploit details.

## Deployment notes

This MVP is not yet ready to handle sensitive production reports. It does not yet include persistent rate limiting, administrator controls, secure contact requests, abuse review, or deployment-specific security headers. Before production use, complete the roadmap in the README, use a protected MongoDB deployment, configure HTTPS and secrets, and review public/private data access paths.

Management URLs are bearer credentials. They are stored as SHA-256 hashes in the database, expire after 90 days, and must not be shared publicly or copied into application logs.
