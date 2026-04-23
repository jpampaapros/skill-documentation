# Security — {{PROJECT_NAME}}

Current security posture. Honest, not aspirational.

## Threat model

<!--
Who might attack this, and why. Skip the CIA triad lecture — be specific:
- Unauthenticated users on the public internet
- Authenticated users trying to access other tenants' data
- Insider threat (employee with DB access)
- Supply-chain (dependency compromise)

For each, note what they could plausibly do.
-->

## Authentication

<!--
How users prove identity. Provider, session strategy, token lifetime,
refresh policy. Where credentials are stored.
-->

## Authorization

<!--
How access is scoped. Multi-tenant isolation, role-based access, row-level
security if applicable. Document the ONE source of truth — avoid scattered
checks.
-->

## Secrets

<!--
Where secrets live. NEVER list values. Note rotation policy.
-->

## Data handling

<!--
What PII / sensitive data is stored, and how. Encryption at rest, in transit.
Retention policy. Deletion policy.
-->

## Known gaps

<!--
Security is never "done". List the things you know are weak and why they
haven't been fixed yet (usually prioritization). This is more useful than
pretending the product is hardened.
-->

## Last audit

<!-- YYYY-MM-DD by <name or firm>. Link the report if available. -->
