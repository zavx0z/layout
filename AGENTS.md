# Layout agent rules

- Use `$layout-dev` from `.agents/skills/layout-dev` for Layout implementation
  and tests. Use the single global `$storybook` for `@layout/storybook`
  lifecycle, static Pages builds and browser verification.
- Read `ARCHITECTURE.md`, the affected package contract, public types,
  implementation, and focused tests before changing behavior.
- Keep visual Elements, Components, themes, icons, node-authoring policy, and
  MetaFor product semantics outside `@layout/core`.
- Preserve the supplied checkout, unrelated changes, linked dependency
  identity, listeners, and browser targets. Publishing or updating consumers
  requires an explicit request.
