import { getRendererHandlers, tipc } from "@egoist/tipc/main"
import type { MessageBoxOptions } from "electron"
import { dialog, Menu, ShareMenu } from "electron"

import { getMainWindow } from "."
import type { RendererHandlers } from "./renderer-handlers"

const t = tipc.create()

export const router = {
  inspectElement: t.procedure
    .input<{ x: number, y: number }>()
    .action(async ({ input, context }) => {
      context.sender.inspectElement(input.x, input.y)
    }),

  showContextMenu: t.procedure
    .input<{
      items: Array<{ type: "text", label: string } | { type: "separator" }>
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
      const handlers = getRendererHandlers<RendererHandlers>(mainWindow.webContents)
      handlers.invalidateQuery.send(input)
    }),
}

export type Router = typeof router
