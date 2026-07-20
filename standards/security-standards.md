# Security standards

- Secrets never enter the repo, logs, or error messages; use the platform secret store. CI runs secret scanning.
- All input is untrusted: validate at the edge, encode at output, parameterize every query.
- AuthN at the edge, authZ at the domain boundary; deny by default.
- Dependencies: pin versions, automated vulnerability scanning, upgrades are ordinary chores not events.
- New external surface (endpoint, queue, webhook) requires the security checklist (`checklists/security.md`) in the PR.
