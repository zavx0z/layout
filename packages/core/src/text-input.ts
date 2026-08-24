export type TextInputController = Readonly<{
  handleKey(event: KeyboardEvent): boolean
  insertText(text: string): boolean
  hasActiveInput(): boolean
  blur(nextHitKey?: string | null): boolean
}>

const controllers = new WeakMap<object, TextInputController>()

export function registerTextInputController(owner: object, controller: TextInputController): void {
  controllers.set(owner, controller)
}

export function unregisterTextInputController(owner: object): void {
  controllers.delete(owner)
}

export function handleActiveInputKey(owner: object, event: KeyboardEvent): boolean {
  return controllers.get(owner)?.handleKey(event) ?? false
}

export function insertActiveInputText(owner: object, text: string): boolean {
  return controllers.get(owner)?.insertText(text) ?? false
}

export function surfaceHasActiveInput(owner: object): boolean {
  return controllers.get(owner)?.hasActiveInput() ?? false
}

export function blurActiveInput(owner: object, nextHitKey: string | null = null): boolean {
  return controllers.get(owner)?.blur(nextHitKey) ?? false
}
