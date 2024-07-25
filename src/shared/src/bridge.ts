import type { GeneralSettings } from "@renderer/atoms/settings/general"
import type { UISettings } from "@renderer/atoms/settings/ui"
import type { BrowserWindow } from "electron"
import type { toast } from "sonner"

const PREFIX = "__follow"
interface RenderGlobalContext {
  showSetting: () => void
  getGeneralSettings: () => GeneralSettings
  getUISettings: () => UISettings
  toast: typeof toast
}

export const registerGlobalContext = (context: RenderGlobalContext) => {
  globalThis[PREFIX] = context
}

export function callGlobalContextMethod(
  window: BrowserWindow,
  method: string,
  args?: any[]
): void

export function callGlobalContextMethod<T extends keyof RenderGlobalContext>(
  window: BrowserWindow,
  method: T,

  // @ts-expect-error
  args: Parameters<RenderGlobalContext[T]> = [] as any
): void
export function callGlobalContextMethod<T extends keyof RenderGlobalContext>(
  window: BrowserWindow,
  method: T,

  args: Parameters<RenderGlobalContext[T]> = [] as any,
) {
  return window.webContents.executeJavaScript(
    `globalThis.${PREFIX}.${method}(${args
      .map((arg) => JSON.stringify(arg))
      .join(",")})`,
  )
}
