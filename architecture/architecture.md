# Architecture

> Replace placeholders. Keep under 150 lines; link out for depth.

## What we are building
<One paragraph: the system, its users, the one invariant that must never break.>

## System shape
<Diagram or list: major components and the direction of dependencies between them.>

## Organization
- `src/<layer>/...` — <what lives here>
- Tests live <where>, named <how>.

## Allowed patterns
- <e.g. hexagonal layering: domain → application → adapters → entrypoints>
- <e.g. constructor injection; repositories behind interfaces>

## Forbidden patterns
- <e.g. service locator, God classes, cross-domain imports, business logic in controllers>
- See `examples/bad/` for annotated instances.

## Quality bar
- <coverage expectation, review requirements, performance budgets>
