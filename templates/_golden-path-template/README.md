# Golden path: <topology name>

**Use for:** <the 80% case this path serves> · **Do not use for:** <the tempting misuse>

## What you inherit
- Skeleton: `src/` layout matching `architecture/layering.md`
- Contract: pre-filled `architecture/architecture.md` + `dependency-rules.md` for this topology
- Sensors: CI pipeline with post-edit/pre-commit/ci stages wired (see `docs/loop-engineering.md`)
- Knowledge: stack-specific skill additions, checklist lines, and `examples/`
- Agent shims: generated via `scripts/sync.mjs`

## Create a project
<the copy/degit/scaffold command for this path>

## First hour
1. Rename placeholders; fill the two `<...>` blocks in architecture.md
2. Run the pre-commit sensors once — must be green on the skeleton
3. Write the first `context/` doc for your actual domain
