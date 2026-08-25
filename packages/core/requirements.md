# `@layout/core` requirements

This document is the canonical owner contract for generic UI layout,
retained-subtree ownership, and clipping. Consumer repositories reference the
stable requirement IDs below; they do not redefine these laws.

Normative terms such as **must** and **must not** describe required behaviour.
An implementation note or current-status statement does not weaken a
requirement.

## Semantic child slots

### LAYOUT-SLOT-001 — Parent-authoritative semantic child rectangle

The immediate parent is the sole authority that allocates the local
`x`/`y`/`w`/`h` rectangle for each semantic child slot. A child consumes that
rectangle and may subdivide it for its own descendants, but it must not derive
or override its rectangle from sibling geometry.

Visual drawing, clipping, and input for a child are expressed within and
relative to the same allocated local rectangle and parent coordinate space. A
nested composition becomes a parent only for the descendants inside the
rectangle it received.

### LAYOUT-FLEX-001 — One Flex plan for sibling semantic slots

A parent with two or more sibling semantic child slots must allocate all of
those sibling rectangles in one exact `flexRow`, `flexColumn`, `flexRowCss`, or
`flexColumnCss` plan. Manual sibling cursors, offsets, percentage arithmetic,
or fixture-specific sibling coordinates must not replace that plan.

The callback for each Flex item receives its authoritative child rectangle
under [LAYOUT-SLOT-001](#layout-slot-001--parent-authoritative-semantic-child-rectangle).
A nested group uses another Flex plan inside its received rectangle.

Primitive local geometry is the only coordinate-arithmetic exception. A child
may calculate vertices, strokes, radii, glyph placement, hit geometry, or other
primitive details inside its one already allocated slot. That arithmetic must
not allocate or position a sibling semantic slot.

If the four public planners cannot express a required sibling composition,
their generic deterministic API and implementation must be extended before a
consumer uses that composition. Renderer, visual-component, node-authoring,
and product vocabulary remain outside the planner.

## Retained UI subtrees

### LAYOUT-RETAINED-001 — Surface-owned retained parent

Each independently dirty UI subtree materializes in local coordinates under
one stable retained Engine parent created and owned by its `UiSurface`. A
retained parent may be nested only under another parent owned by the same
Surface. A parallel UI scene graph, an `Object3D` not created and owned by that
`UiSurface`, or manual repetition of an ancestor transform in individual
descendants must not replace this ownership chain.

The retained parent and its ancestors form one authoritative transform,
visibility, clip, and input chain for the subtree's visual descendants, pointer
hits, and wheel targets. Materialization atomically replaces the local visual
and input subtree owned by that exact parent.

A content, available-size, or style change may require a new Flex plan and
materialization for the affected parent. A transform-only, visibility-only, or
clip-only change instead updates the existing retained chain without a new
Flex plan or materialization and preserves the identity of the parent, its
unchanged children, and their geometry.

## Clip parity

### LAYOUT-CLIP-001 — Descendant and input clip parity

Every parent clip, including a rounded parent boundary, must constrain the
same region for descendant pixels, pointer hits, wheel targets, and scrollbars.
Nested clips intersect through the retained parent chain; no descendant may
draw or respond outside the resulting region.

**Current status: implemented at the Layout boundary.** `UiSurface.withChildClip`
normalizes one immutable analytical shape chain and snapshots it onto every
emitted Engine visual plus the corresponding immediate or retained pointer,
wheel, and dismissable records. Nested scopes intersect outer-to-inner;
retained portals keep the exact owner chain. `UiSurfaceOpts.borderRadiusPx`
establishes the same root content/input boundary.

The Engine evaluates each visual shape through its declared `Object3D`
coordinate space, while Layout uses the same rounded-box predicate and corner
order for CPU input. Invalid shapes and non-invertible transforms fail closed.
Transform-, visibility-, and rectangular viewport-clip-only changes preserve
retained parent, child, geometry, and scoped-chain identity. Transaction
rollback, remove, and dispose preserve or release the complete matching visual
and input evidence atomically.

`pushClip`/`popClip` and retained viewport clips remain rectangular
broad-phase primitives; they are not the shaped parity API. Focused proof is in
`src/surface-child-clip.test.ts` and covers immediate and retained metadata,
rounded hit/wheel rejection, nested scopes, screen-minimum input, rollback,
transform, visibility, disposal, portal inheritance, and the Surface root.
