import { getRendererHandlers } from "@egoist/tipc/main"
import type { BrowserWindow } from "electron"

import { cleanAuthSessionToken, cleanUser } from "../lib/user"
import type { RendererHandlers } from "../renderer-handlers"
import { quitAndInstall } from "../updater"
import { getMainWindow } from "../window"
import { t } from "./_instance"

export const appRoute = {
  saveToEagle: t.procedure
    .input<{ url: string, mediaUrls: string[] }>()
    .action(async ({ input }) => {
      try {
        const res = await fetch("http://localhost:41595/api/item/addFromURLs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: input.mediaUrls?.map((media) => ({
              url: media,
              website: input.url,
              headers: {
                referer: input.url,
              },
            })),
          }),
        })
        return await res.json()
      } catch {
        return null
      }
    }),

  invalidateQuery: t.procedure
    .input<(string | number | undefined)[]>()
    .action(async ({ input }) => {
      const mainWindow = getMainWindow()
      if (!mainWindow) return
      const handlers = getRendererHandlers<RendererHandlers>(
        mainWindow.webContents,
      )
      handlers.invalidateQuery.send(input)
    }),

  windowAction: t.procedure
    .input<{ action: "close" | "minimize" | "maximum" }>()
    .action(async ({ input, context }) => {
      if (context.sender.getType() === "window") {
        const window: BrowserWindow | null = (
          context.sender as Sender
        ).getOwnerBrowserWindow()

        if (!window) return
        switch (input.action) {
          case "close": {
            window.close()
            break
          }
          case "minimize": {
            window.minimize()
            break
          }
          case "maximum": {
            if (window.isMaximized()) {
              window.unmaximize()
            } else {
              window.maximize()
            }
            break
          }
        }
      }
    }),
  quitAndInstall: t.procedure.action(async () => {
    quitAndInstall()
  }),

  cleanAuthSessionToken: t.procedure.action(async () => {
    cleanAuthSessionToken()
    cleanUser()
  }),
}
interface Sender extends Electron.WebContents {
  getOwnerBrowserWindow: () => Electron.BrowserWindow | null
}
