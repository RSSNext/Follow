import { getRendererHandlers, tipc } from "@egoist/tipc/main"
import type { MessageBoxOptions } from "electron"
import { app, dialog, Menu, ShareMenu } from "electron"

import { getMainWindow } from "."
import type { RendererHandlers } from "./renderer-handlers"
import { createSettingWindow, createWindow } from "./window"

const t = tipc.create()

export const router = {
  inspectElement: t.procedure
    .input<{ x: number, y: number }>()
    .action(async ({ input, context }) => {
      context.sender.inspectElement(input.x, input.y)
    }),

  showContextMenu: t.procedure
    .input<{
      items: Array<
        | { type: "text", label: string, enabled?: boolean }
        | { type: "separator" }
      >
    }>()
    .action(async ({ input, context }) => {
      const menu = Menu.buildFromTemplate(
        input.items.map((item, index) => {
          if (item.type === "separator") {
            return {
              type: "separator" as const,
            }
          }
          return {
            label: item.label,
            enabled: item.enabled ?? true,
            click() {
              context.sender.send("menu-click", index)
            },
          }
        }),
      )

      menu.popup({
        callback: () => {
          context.sender.send("menu-closed")
        },
      })
    }),

  showConfirmDialog: t.procedure
    .input<{
      title: string
      message: string
      options?: Partial<MessageBoxOptions>
    }>()
    .action(async ({ input }) => {
      const result = await dialog.showMessageBox({
        message: input.title,
        detail: input.message,
        buttons: ["Confirm", "Cancel"],
        ...input.options,
      })
      return result.response === 0
    }),

  showShareMenu: t.procedure
    .input<string>()
    .action(async ({ input, context }) => {
      const menu = new ShareMenu({
        urls: [input],
      })

      menu.popup({
        callback: () => {
          context.sender.send("menu-closed")
        },
      })
    }),

  saveToEagle: t.procedure
    .input<{ url: string, images: string[] }>()
    .action(async ({ input }) => {
      try {
        const res = await fetch("http://localhost:41595/api/item/addFromURLs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: input.images?.map((image) => ({
              url: image,
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
      const handlers = getRendererHandlers<RendererHandlers>(
        mainWindow.webContents,
      )
      handlers.invalidateQuery.send(input)
    }),

  /**
   * @deprecated
   */
  previewImage: t.procedure
    .input<{
      realUrl: string
      url: string
      width: number
      height: number
    }>()
    .action(async ({ input }) => {
      if (
        process.env["VITE_IMGPROXY_URL"] &&
        input.url.startsWith(process.env["VITE_IMGPROXY_URL"])
      ) {
        const meta = await fetch(
          `${process.env["VITE_IMGPROXY_URL"]}/unsafe/meta/${encodeURIComponent(
            input.realUrl,
          )}`,
        ).then((res) => res.json())
        input.width = meta.thumbor.source.width
        input.height = meta.thumbor.source.height
      }
      createWindow({
        extraPath: `/preview?url=${encodeURIComponent(input.realUrl)}`,
        width: input.width,
        height: input.height,
      })
    }),

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
  setMacOSBadge: t.procedure.input<number>().action(async ({ input }) => {
    app.setBadgeCount(input)
  }),
}

export type Router = typeof router
