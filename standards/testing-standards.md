# Testing standards

- Every behavior change ships with tests in the same PR. No "tests later".
- Test behavior through public interfaces; asserting private internals couples tests to implementation.
- Unit tests: no network, no real DB, milliseconds. Integration tests: real adapters, marked and separable.
- A failing test is fixed by fixing the code — weakening an assertion to pass requires reviewer sign-off and a comment saying why.
- Name tests as statements: `rejects_expired_token`, not `test1`.
- Coverage is a smoke detector, not a goal; uncovered critical paths block, gaming coverage with assert-free tests is forbidden.
