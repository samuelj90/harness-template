# Error handling

- Exceptions/domain errors for exceptional states; result types where the caller must always decide.
- Catch narrowly, at the layer that can act. Entrypoints translate to API errors; nothing else catches broadly.
- Never swallow: every catch either recovers meaningfully, rethrows with context, or logs at error with the original cause attached — exactly once per failure.
- Messages carry what a responder needs at 3am: operation, key identifiers (never secrets/PII), cause.
- Retries only around idempotent operations, with backoff and a budget; circuit-break external calls.
