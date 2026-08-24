import {Color, TextMaterial} from "@engine/core"

const rgb = (red: number, green: number, blue: number, alpha = 1): Color =>
  new Color(red / 255, green / 255, blue / 255, alpha)

/** Minimal default colors used by the low-level surface runtime itself. */
export const surfacePalette = {
  transparent: rgb(0, 0, 0, 0),
  background: rgb(27, 34, 45, 0.98),
  border: rgb(116, 130, 151, 1),
  activeBorder: rgb(132, 192, 220, 0.82),
  text: rgb(232, 238, 247, 1),
  muted: rgb(139, 150, 166, 1),
  cyan: rgb(111, 211, 255, 1),
  green: rgb(82, 196, 123, 1),
  orange: rgb(255, 190, 111, 1),
  red: rgb(255, 127, 111, 1),
  blue: rgb(92, 155, 255, 1),
  violet: rgb(197, 151, 255, 1),
  warn: rgb(210, 153, 34, 1),
  error: rgb(247, 129, 102, 1),
} as const

export type SurfaceTone = "neutral" | "live" | "paused" | "warn"

/** Reusable text materials owned by one retained surface. */
export class SurfaceMaterials {
  readonly text = new TextMaterial({color: surfacePalette.text})
  readonly muted = new TextMaterial({color: surfacePalette.muted})
  readonly cyan = new TextMaterial({color: surfacePalette.cyan})
  readonly green = new TextMaterial({color: surfacePalette.green})
  readonly orange = new TextMaterial({color: surfacePalette.orange})
  readonly red = new TextMaterial({color: surfacePalette.red})
  readonly blue = new TextMaterial({color: surfacePalette.blue})
  readonly violet = new TextMaterial({color: surfacePalette.violet})
  readonly warn = new TextMaterial({color: surfacePalette.warn})
  readonly error = new TextMaterial({color: surfacePalette.error})

  toneText(tone: SurfaceTone): TextMaterial {
    if (tone === "live") return this.green
    if (tone === "paused") return this.orange
    if (tone === "warn") return this.red
    return this.text
  }
}
