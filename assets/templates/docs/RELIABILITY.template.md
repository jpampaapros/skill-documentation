# Reliability — {{PROJECT_NAME}}

How failures are detected, handled, and recovered from.

## Failure domains

<!--
List the boundaries where failure can occur:
- External API calls
- Database
- Background jobs / queues
- User input
- Third-party auth

For each, note the blast radius if it fails.
-->

## Error handling policy

<!--
One canonical way to handle errors. Answer:
- Where are errors caught? (boundary, per-function, global handler)
- What is logged?
- What is shown to the user?
- Are errors ever swallowed? If yes, why, and where?
-->

## Retries and timeouts

<!--
Default timeouts for external calls, retry strategy (exponential backoff?),
circuit breakers if any. Be explicit about which operations are idempotent
and which are NOT.
-->

## Monitoring

<!--
What is monitored, and where alerts go. Link the dashboard and the runbook
if they exist.
-->

## Known fragility

<!--
Honest list of things that break or degrade under load. Keep this updated —
hidden fragility is worse than documented fragility.
-->
