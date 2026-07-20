# API patterns

- Resource-oriented URLs, plural nouns; verbs only for true actions (`/orders/{id}/cancel`).
- DTOs are immutable and versioned; never expose domain entities over the wire.
- Errors: RFC 7807 problem+json — `type`, `title`, `status`, `detail`, `traceId`. Never leak stack traces.
- Pagination: cursor-based for lists that grow; document limits.
- Every endpoint: input validation at the edge, idempotency for anything non-GET that may be retried.
- Breaking changes require a new version and an ADR.
