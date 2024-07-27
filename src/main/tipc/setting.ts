import { createRequire } from "node:module"

import { app, nativeTheme } from "electron"

import { setDockCount } from "../lib/dock"
import { createSettingWindow } from "../window"
import { t } from "./_instance"

const require = createRequire(import.meta.url)
export const settingRoute = {
  getLoginItemSettings: t.procedure
    .input<void>()
    .action(async () => await app.getLoginItemSettings()),
  setLoginItemSettings: t.procedure
    .input<boolean>()
    .action(async ({ input }) => {
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
            resolve(fonts.map((font) => font.replaceAll("\"", "")))
          })
      }),
  ),
  setAppearance: t.procedure
    .input<"light" | "dark" | "system">()
    .action(async ({ input }) => {
      // NOTE: Temporarily changing to system to get the color mode that system is in at the moment may cause a bit of a problem.
      // On macos, there is a bug,  traffic lights flicker
      nativeTheme.themeSource = "system"
      const systemColorMode = nativeTheme.shouldUseDarkColors ?
        "dark" :
        "light"

      nativeTheme.themeSource = systemColorMode === input ? "system" : input
    }),
  setDockBadge: t.procedure.input<number>().action(async ({ input }) => {
    setDockCount(input)
  }),
}
