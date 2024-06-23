import type { BrowserWindow } from "electron"

const PREFIX = "__follow"
interface RenderGlobalContext {
  showSetting: () => void
}

export const registerGlobalContext = (context: RenderGlobalContext) => {
  globalThis[PREFIX] = context
}
export const callGlobalContextMethod = (
  window: BrowserWindow,
  method: keyof RenderGlobalContext,
) => window.webContents.executeJavaScript(`globalThis.${PREFIX}.${method}()`)
