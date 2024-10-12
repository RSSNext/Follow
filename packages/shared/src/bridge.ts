import type { BrowserWindow } from "electron"
import type { toast } from "sonner"

import type { GeneralSettings, UISettings } from "./interface/settings"

const PREFIX = "__follow"

interface RenderGlobalContext {
  /// Access Settings
  showSetting: (path?: string) => void
  getGeneralSettings: () => GeneralSettings
  getUISettings: () => UISettings

  /**
   * @description only work in electron app
   */
  onWindowClose: () => void
  /**
   * @description only work in electron app
   */
  onWindowShow: () => void

  /// Actions
  follow: (options?: { isList: boolean; id?: string; url?: string }) => void
  profile: (id: string, variant?: "drawer" | "dialog") => void

  // user data
  clearIfLoginOtherAccount: (newUserId: string) => void

  /// Utils
  toast: typeof toast
  // URL
  getWebUrl: () => string
  getApiUrl: () => string
}

export const registerGlobalContext = (context: Partial<RenderGlobalContext>) => {
  globalThis[PREFIX] = {
    ...globalThis[PREFIX],
    ...context,
  }
}

function createProxy<T extends RenderGlobalContext>(window: BrowserWindow, path: string[] = []): T {
  return new Proxy((() => {}) as any, {
    get(_, prop: string) {
      const newPath = [...path, prop]

      return createProxy(window, newPath)
    },
    async apply(_, __, args: any[]) {
      const methodPath = path.join(".")

      try {
        return await window.webContents.executeJavaScript(
          `globalThis.${PREFIX}?.${methodPath}?.(${args.map((arg) => JSON.stringify(arg)).join(",")})`,
        )
      } catch (err) {
        console.error(`Failed to executeJavaScript: ${methodPath}`, err)
      }
    },
  })
}
type AddPromise<T> = T extends (...args: infer A) => Promise<infer R>
  ? (...args: A) => Promise<R>
  : T extends (...args: infer A) => infer R
    ? (...args: A) => Promise<Awaited<R>>
    : any

type Fn<T> = {
  [K in keyof T]: AddPromise<T[K]> &
    (T[K] extends object ? { [P in keyof T[K]]: AddPromise<T[K][P]> } : never)
}
export function callWindowExpose<T extends RenderGlobalContext>(window: BrowserWindow) {
  return createProxy(window) as Fn<T>
}
