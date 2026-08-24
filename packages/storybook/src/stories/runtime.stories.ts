import {Color} from "@engine/core"
import {UiSurface, Z} from "@layout/core/surface"

export class RuntimeStory extends UiSurface {
  protected override render(): void {
    this.drawRoundedRect(0, 0, this.rectW, this.rectH, {
      radius: 6,
      fill: new Color(0.075, 0.09, 0.115, 0.96),
      border: new Color(0.32, 0.38, 0.46, 1),
      borderWidth: 1,
      z: Z.CONTAINER,
    })
    this.drawText("UI runtime", 22, 30, {fontPx: 17, material: this.materials.text, z: Z.TEXT})
    this.drawText("one renderer · retained surfaces · HUD · spatial displays", 22, 58, {
      fontPx: 11,
      material: this.materials.muted,
      maxWidthPx: Math.max(1, this.rectW - 44),
      z: Z.TEXT,
    })
    this.drawRect(22, 86, Math.max(1, this.rectW - 44), 1, new Color(0.22, 0.27, 0.33, 1), Z.SEPARATOR)
    this.drawText("Built for MetaFor", 22, 112, {fontPx: 12, material: this.materials.cyan, z: Z.TEXT})
  }
}
