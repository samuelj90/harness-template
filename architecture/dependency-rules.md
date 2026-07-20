# Dependency rules

The single most enforceable architecture file. Agents: these are hard constraints, not preferences.

## Layering (edit to your layout)
| From ↓ may import → | domain | application | adapters | entrypoints |
|---|---|---|---|---|
| domain | ✅ | ❌ | ❌ | ❌ |
| application | ✅ | ✅ | ❌ | ❌ |
| adapters | ✅ | ✅ | ✅ | ❌ |
| entrypoints | ✅ | ✅ | ✅ | ✅ |

## Rules
1. No circular dependencies, ever.
2. `domain` imports nothing outside itself and the stdlib.
3. Third-party libraries are wrapped in `adapters`; domain and application never import them directly.
4. Shared code moves *down* the table, never sideways via copy-paste.

## Enforcement
Mechanical checks live in CI (dependency-cruiser / import-linter / ArchUnit — see `docs/loop-engineering.md`). If a check blocks an import you need, move the code; do not loosen the rule without an ADR.
