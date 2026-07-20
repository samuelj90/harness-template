# AI Engineering Baseline (AEB)

**A repository that teaches any coding agent how your team builds software.**

Not an AI framework. No model APIs, no orchestrator, no SDKs. The repository *is* the API: coding agents already have their own loops — this baseline supplies the knowledge those loops consume.

```
            Any Coding Agent
  Copilot · Claude Code · Codex · Gemini CLI
  GitLab Duo · Cursor · Windsurf · Cline · …
                    │
                    ▼
        ┌───────────────────────┐
        │  Repository Harness   │
        │  context · rules      │
        │  skills · ADRs        │
        │  templates · examples │
        │  checklists           │
        │  verification         │
        │  CI feedback          │
        └───────────────────────┘
                    │
                    ▼
            High-quality code
```

Instead of asking *"how do I integrate with Copilot?"*, ask *"how can Copilot understand my repository with zero prompting?"*

## The layers
| # | Layer | Where | Answers |
|---|---|---|---|
| 1 | Repository contract | `architecture/` | What are we building? What's allowed/forbidden? |
| 2 | Context | `context/` | Small focused domain docs (30×150 lines, not 1×4000) |
| 3 | Skills | `skills/` | Repeatable processes: goal, constraints, checklist, anti-patterns |
| 4 | Examples | `examples/good`, `examples/bad` | Concrete patterns to imitate and avoid |
| 5 | Golden paths | `templates/` | New projects inherit docs + rules + CI + skills |
| 6 | Checklists | `checklists/` | "Run the production checklist" beats "make it production-ready" |
| 7 | Verification | `verification/` | Generation is easy; verification is the product |
| 8 | ADRs | `architecture/adr/` | The WHY, not just the WHAT |
| 9 | Multi-agent support | `.claude/ .github/ .cursor/ …` | Generated shims, one canonical source (`AGENTS.md`) |
| 10 | Self-evaluation | `verification/self-evaluation.md` | Every task ends with a scorecard |
| 11 | Continuous improvement | `docs/continuous-improvement.md` | Incidents become rules, skills, examples |

Plus: `docs/loop-engineering.md` — how to place feedforward guides and feedback sensors around the agent loop each tool already runs.

## Adopt into a project
```bash
npx degit <you>/harness-template baseline && cp -r baseline/{AGENTS.md,architecture,context,standards,skills,checklists,verification,examples,prompts,scripts} your-repo/
cd your-repo && node scripts/sync.mjs      # generate per-agent shims
```
Then: fill the placeholders in `architecture/` and `context/`, delete what doesn't apply, and start the improvement loop (`docs/continuous-improvement.md`).

## Explicitly excluded
Custom AI orchestration, LangChain/LangGraph, MCP servers as core dependency (optional extension only), model-specific SDKs, provider-tied prompt pipelines. They add maintenance without helping when your users are existing coding agents.
