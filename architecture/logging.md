# Logging & observability

- Structured logs (JSON), one event per line; include `traceId`/correlation id on every entry.
- Levels: error = human should look; warn = degraded but handled; info = business-relevant state change; debug = off in prod.
- Never log secrets, tokens, or PII. Redaction is the producer's job, not the collector's.
- Every new feature ships with: a log line at its success path, an error log at failure, and a metric (count + latency) if it's on a request path.
- Prefer widening an existing dashboard/alert over inventing a new one.
