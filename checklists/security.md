# Checklist: security
- [ ] All new input validated at the edge; queries parameterized; output encoded
- [ ] AuthN enforced at entrypoint, authZ at domain boundary, deny-by-default verified with a test
- [ ] No secret in code/config/logs; secret scanning green
- [ ] New dependencies scanned; licenses acceptable
- [ ] Failure modes don't leak internals (stack traces, versions, queries)
