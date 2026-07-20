# Checklist: release
- [ ] CI fully green including integration suites; no skipped/quarantined tests without linked issues
- [ ] Migrations backward-compatible one release back; rollback path stated
- [ ] Config/secret changes applied to all environments before deploy
- [ ] Dashboards/alerts cover the new surface; on-call notes updated
- [ ] Changelog entry written for humans, not commit-log paste
