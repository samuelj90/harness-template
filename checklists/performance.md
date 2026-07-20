# Checklist: performance
- [ ] Hot-path queries reviewed: indexes used, no N+1 (show the plan or the ORM log)
- [ ] External calls: timeout + retry budget + circuit breaker where fan-out
- [ ] Payloads bounded: pagination on growing lists, streaming for large bodies
- [ ] Added latency measured against the budget in `architecture/architecture.md`
- [ ] Caches have invalidation stories, not just TTL hope
