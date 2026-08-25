/** Cross-axis alignment used by a parent-owned Flex plan. */
export type FlexAlign = "start" | "center" | "end" | "stretch"
/** Main-axis distribution used by a parent-owned Flex plan. */
export type FlexJustify = "start" | "center" | "end" | "space-between" | "space-around"

/**
 * Authoritative parent rectangle and flow constraints for one sibling-slot
 * plan. Item callbacks receive child rectangles in this coordinate space.
 *
 * @see [LAYOUT-SLOT-001 and LAYOUT-FLEX-001](../requirements.md#semantic-child-slots)
 */
export type FlexBoxBase = {
  x: number
  y: number
  w: number
  h: number
  paddingX?: number
  paddingY?: number
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  paddingBottom?: number
  gap?: number
  alignItems?: FlexAlign
  justifyContent?: FlexJustify
}

/** Fixed logical pixels or a proportional share of the remaining main axis. */
export type FlexMainSize = number | "grow" | `${number}fr`

/**
 * One semantic child slot in a horizontal Flex plan.
 *
 * `draw` receives the slot's authoritative local rectangle. Coordinate
 * arithmetic inside that rectangle is for primitive local geometry, not for
 * positioning sibling semantic slots.
 *
 * @see [LAYOUT-FLEX-001](../requirements.md#semantic-child-slots)
 */
export type FlexRowItem = {
  width: FlexMainSize
  height: number
  alignSelf?: FlexAlign
  draw(x: number, y: number, width: number, height: number): void
}

/**
 * One semantic child slot in a vertical Flex plan.
 *
 * `draw` receives the slot's authoritative local rectangle. Coordinate
 * arithmetic inside that rectangle is for primitive local geometry, not for
 * positioning sibling semantic slots.
 *
 * @see [LAYOUT-FLEX-001](../requirements.md#semantic-child-slots)
 */
export type FlexColumnItem = {
  height: FlexMainSize
  width?: number
  alignSelf?: FlexAlign
  draw(x: number, y: number, width: number, height: number): void
}

/** One complete horizontal sibling-slot plan. */
export type FlexRowOpts = FlexBoxBase & {items: Array<FlexRowItem | null | undefined | false>}
/** One complete vertical sibling-slot plan. */
export type FlexColumnOpts = FlexBoxBase & {items: Array<FlexColumnItem | null | undefined | false>}
