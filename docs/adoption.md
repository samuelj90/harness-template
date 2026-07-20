# Adopting the baseline

1. Copy the knowledge layers into your repo: `AGENTS.md architecture/ context/ standards/ skills/ checklists/ verification/ examples/ prompts/ scripts/`.
2. `node scripts/sync.mjs` — generates the per-agent shims (.claude/, .github/, .cursor/, .gemini/, .windsurf/, .clinerules, .gitlab/).
3. Fill the placeholders: `architecture/architecture.md` first (the contract), then one `context/` doc per real domain. Delete anything that doesn't apply — an empty section is honest, a wrong one is poison.
4. Wire sensors per `docs/loop-engineering.md`: fast checks in-loop/pre-commit, the rest in CI.
5. Seed `examples/` from your actual codebase within the first week.
6. Book the improvement loop into your rituals (retro action = baseline PR).

Adoption is done when a brand-new agent session, given only `prompts/kickoff.md` phrasing, produces work that passes `verification/` without any oral tradition.
