# Continuous improvement (Layer 11)

The baseline compounds in value only if lessons land in it. Whenever the team hits a production incident, a painful review, a recurring architectural mistake, or an onboarding stumble — the response is not just "fix the code":

| Lesson type | Baseline change |
|---|---|
| "We keep making this mistake" | new rule in `standards/` or `architecture/` + a `bad/` example |
| "This task always goes the same way" | new or sharpened skill in `skills/` |
| "Review caught something subtle" | `examples/good/` or `bad/` entry + checklist line |
| "Why did we ever choose X?" | ADR in `architecture/adr/` |
| "The agent didn't know Y" | `context/` doc created or corrected |
| "This slipped to production" | new sensor (check) at the earliest viable stage |

Rules of the loop: every incident retro ends with at least one baseline PR (or an explicit "nothing to encode"); baseline PRs are reviewed like code; stale knowledge is deleted on sight — a wrong doc is worse than none. Agents are required (AGENTS.md rule 6) to propose baseline changes when they hit preventable failures, so the repository learns from every session.
