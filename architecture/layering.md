# Layering

- **domain** — entities, value objects, domain services. Pure: no I/O, no framework types.
- **application** — use cases orchestrating domain objects; defines ports (interfaces) for I/O.
- **adapters** — implementations of ports: DB, HTTP clients, queues, framework glue.
- **entrypoints** — controllers, CLI, consumers, schedulers. Thin: parse → call use case → format.

Placement test for any new code: *"could this run in a unit test with no network, no DB, no framework?"* Yes → domain/application. No → adapters/entrypoints.
