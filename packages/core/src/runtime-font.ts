import {loadDocumentDefaultFont, loadSharedFont, type DefaultFontDocument} from "@engine/core/default-font"
import type {TrueTypeFont} from "@engine/core"

export type UiRuntimeFontOptions = {
  /**
  Parsed custom font owned by the composition root.

  Passing an instance performs no font fetch and bypasses both `fontUrl` and the
  document default.
  */
  font?: TrueTypeFont
  /**
  Custom TTF URL loaded through Engine's shared URL cache.

  The URL may be relative to the current document. It bypasses the document
  default and cannot be combined with `font`.
  */
  fontUrl?: string
}

export async function resolveUiRuntimeFont(
  options: UiRuntimeFontOptions,
  documentRef?: DefaultFontDocument,
): Promise<TrueTypeFont> {
  if (options.font !== undefined && options.fontUrl !== undefined) {
    throw new Error("UiRuntime accepts either font or fontUrl, not both")
  }
  if (options.font !== undefined) return options.font
  if (options.fontUrl !== undefined) return loadSharedFont(options.fontUrl, documentRef?.baseURI)
  return documentRef === undefined ? loadDocumentDefaultFont() : loadDocumentDefaultFont(documentRef)
}
