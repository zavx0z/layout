import {describe, expect, test} from "bun:test"
import {loadSharedFont, type DefaultFontDocument} from "@engine/core/default-font"
import {resolveUiRuntimeFont} from "./runtime-font"

const fontUrl = import.meta.resolve("@engine/core/fonts/jetbrains-mono-bold.ttf")

describe("UiRuntime font ownership", () => {
  test("returns an explicit font without reading or loading the document default", async () => {
    const font = await loadSharedFont(fontUrl)
    const documentRef = rejectingDocument()
    expect(await resolveUiRuntimeFont({font}, documentRef)).toBe(font)
  })

  test("loads an explicit URL without reading the document default", async () => {
    const documentRef = rejectingDocument()
    expect(await resolveUiRuntimeFont({fontUrl}, documentRef)).toBe(await loadSharedFont(fontUrl))
  })

  test("uses the document declaration only when no custom source exists", async () => {
    let queries = 0
    const documentRef: DefaultFontDocument = {
      baseURI: new URL("./", fontUrl).href,
      querySelector() {
        queries += 1
        return {getAttribute: (name) => name === "content" ? fontUrl : null}
      },
    }
    expect(await resolveUiRuntimeFont({}, documentRef)).toBe(await loadSharedFont(fontUrl))
    expect(queries).toBe(1)
  })

  test("rejects ambiguous custom ownership", async () => {
    const font = await loadSharedFont(fontUrl)
    await expect(resolveUiRuntimeFont({font, fontUrl})).rejects.toThrow("either font or fontUrl")
  })
})

function rejectingDocument(): DefaultFontDocument {
  return {
    baseURI: "https://example.invalid/app/",
    querySelector() {
      throw new Error("document default must not be read")
    },
  }
}
