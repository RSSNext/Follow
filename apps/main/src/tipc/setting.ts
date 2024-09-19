import { createRequire } from "node:module"

import { app, nativeTheme } from "electron"

import { setDockCount } from "../lib/dock"
import { setProxyConfig, updateProxy } from "../lib/proxy"
import { store } from "../lib/store"
import { createSettingWindow } from "../window"
import { t } from "./_instance"

const require = createRequire(import.meta.url)
export const settingRoute = {
  getLoginItemSettings: t.procedure
    .input<void>()
    .action(async () => await app.getLoginItemSettings()),
  setLoginItemSettings: t.procedure.input<boolean>().action(async ({ input }) => {
    app.setLoginItemSettings({
      openAtLogin: input,
    })
  }),
  openSettingWindow: t.procedure.action(async () => createSettingWindow()),
  getSystemFonts: t.procedure.action(
    async (): Promise<string[]> =>
      new Promise((resolve) => {
        // NOTE: should external font-list deps
        // use `require` to avoid bundling, vite behavior
        require("font-list")
          .getFonts()
          .then((fonts) => {
            resolve(fonts.map((font) => font.replaceAll('"', "")))
          })
      }),
  ),
  getAppearance: t.procedure.action(async () => nativeTheme.themeSource),
  setAppearance: t.procedure.input<"light" | "dark" | "system">().action(async ({ input }) => {
    nativeTheme.themeSource = input

    store.set("appearance", input)
  }),
  setDockBadge: t.procedure.input<number>().action(async ({ input }) => {
    setDockCount(input)
  }),
  getProxyConfig: t.procedure.action(async () => store.get("proxy")),
  setProxyConfig: t.procedure.input<string>().action(async ({ input }) => {
    const result = setProxyConfig(input)
    updateProxy()
    return result
  }),
}
