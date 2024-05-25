import { client } from "./client"

export const showNativeMenu = async (
  _items: Array<
    { type: "text", label: string, click: () => void } | { type: "separator" }
  >,
  e?: MouseEvent | React.MouseEvent,
) => {
  const items = [
    ..._items,
    ...(import.meta.env.DEV && e ?
        [
          {
            type: "separator" as const,
          },
          {
            type: "text" as const,
            label: "Inspect Element",
            click: () => {
              client?.inspectElement({
                x: e.pageX,
                y: e.pageY,
              })
            },
          },
        ] :
        []),
  ]

  const el = e && e.currentTarget

  if (el instanceof HTMLElement) {
    el.dataset.contextMenuOpen = "true"
  }

  const unlisten = window.electron?.ipcRenderer.on("menu-click", (_, index) => {
    const item = items[index]
    if (item && item.type === "text") {
      item.click()
    }
  })

  window.electron?.ipcRenderer.once("menu-closed", () => {
    unlisten?.()
    if (el instanceof HTMLElement) {
      delete el.dataset.contextMenuOpen
    }
  })

  await client?.showContextMenu({
    items: items.map((item) => {
      if (item.type === "text") {
        return {
          ...item,
          click: undefined,
        }
      }

      return item
    }),
  })
}
