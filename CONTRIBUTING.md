# Contributing

Layout is open infrastructure built for [MetaFor](https://github.com/zavx0z/metafor) and intended for reuse in other WebGPU projects.

Contributions are welcome in runtime correctness, input and accessibility, performance, spatial-display interaction, documentation, tests, and examples.

## Before opening a pull request

1. Keep visual Elements and Components out of `@layout/core`.
2. Preserve render-on-demand behavior and retained object identity.
3. Add focused tests for observable behavior.
4. Run `bun run check`.
5. Explain how the change affects both flat HUD and optional spatial-display use.

Please open an issue before broad API redesigns so Engine, UI, Node, and MetaFor consumers can be reviewed together.

## Pages bootstrap

The manual Pages workflow checks out Layout and its exact Engine, UI,
Highlighter, and shared Storybook revisions into sibling directories. This
keeps dependency setup outside the Layout Git tree so the static manifest stays
clean. It registers each direct package owner before the locked dependency
installs, then runs the Layout checks and static `/layout/` build. The job
rejects the artifact if its source or any dependency still reports
`dirty: true`.
