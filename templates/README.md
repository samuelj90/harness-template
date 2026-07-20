# Golden paths (Layer 5)

A golden path is a starter a new project inherits **with its harness attached**: not just code, but the docs, rules, CI, examples, skills, and prompts that govern it. Teams commonly need only a handful (business API service, worker, frontend app, CLI, data pipeline).

Each subdirectory here should contain: the stack skeleton, a pre-filled `architecture/` (contract + dependency rules for that topology), stack-specific additions to `skills/` and `checklists/`, CI configured with the sensor stages from `docs/loop-engineering.md`, and the generated agent shims. Start from `_golden-path-template/` and keep each path boring, opinionated, and current — a stale golden path is a trap.
