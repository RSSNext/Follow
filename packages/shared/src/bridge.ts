import type { BrowserWindow } from "electron"
import type { toast } from "sonner"

import type { GeneralSettings, UISettings } from "./interface/settings"

const PREFIX = "__follow"

interface RenderGlobalContext {
  showSetting: (path?: string) => void
  getGeneralSettings: () => GeneralSettings
  getUISettings: () => UISettings

  electronClose: () => void
  electronShow: () => void

  toast: typeof toast
}

export const registerGlobalContext = (context: RenderGlobalContext) => {
  globalThis[PREFIX] = context
}

function createProxy<T extends RenderGlobalContext>(window: BrowserWindow, path: string[] = []): T {
  return new Proxy((() => {}) as any, {
    get(_, prop: string) {
      const newPath = [...path, prop]

      return createProxy(window, newPath)
    },
    apply(_, __, args: any[]) {
      const methodPath = path.join(".")

      return window.webContents.executeJavaScript(
        `globalThis.${PREFIX}.${methodPath}(${args.map((arg) => JSON.stringify(arg)).join(",")})`,
      )
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
