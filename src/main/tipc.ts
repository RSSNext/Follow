import { tipc } from "@egoist/tipc/main"
import { Menu, MessageBoxOptions, dialog } from "electron"

const t = tipc.create()

export const router = {
  inspectElement: t.procedure
    .input<{ x: number; y: number }>()
    .action(async ({ input, context }) => {
      context.sender.inspectElement(input.x, input.y)
    }),

  showContextMenu: t.procedure
    .input<{
      items: Array<{ type: "text"; label: string } | { type: "separator" }>
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
}

export type Router = typeof router
