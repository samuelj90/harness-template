# Verify: architecture
✓ No business logic in entrypoints/controllers (they parse → call → format only)
✓ No circular dependencies introduced (state how you checked)
✓ Dependency table in `architecture/dependency-rules.md` holds for every new import
✓ Third-party libraries touched only via adapters
✓ DTOs immutable; domain entities not exposed over the wire
✓ New abstractions have ≥2 real callers or a written justification
