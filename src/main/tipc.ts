import { tipc } from "@egoist/tipc/main"
import { Menu } from "electron"

const t = tipc.create()

export const router = {
  sum: t.procedure
    .input<{ a: number; b: number }>()
    .action(async ({ input }) => {
      return input.a + input.b
    }),
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
}

export type Router = typeof router
