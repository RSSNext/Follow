import { tipcClient } from "./client"

export type NativeMenuItem =
  | {
    type: "text"
    label: string
    click?: () => void
    enabled?: boolean
  }
  | { type: "separator" }
export const showNativeMenu = async (
  items: Array<Nullable<NativeMenuItem | false>>,
  e?: MouseEvent | React.MouseEvent,
) => {
  const nextItems = items.filter(Boolean) as NativeMenuItem[]

  const el = e && e.currentTarget

  if (el instanceof HTMLElement) {
    el.dataset.contextMenuOpen = "true"
  }

  if (!window.electron) {
    document.dispatchEvent(
      new CustomEvent(CONTEXT_MENU_SHOW_EVENT_KEY, {
        detail: {
          items: nextItems,
          x: e?.clientX,
          y: e?.clientY,
        },
      }),
    )
    return
  } else {
    if (import.meta.env.DEV && e) {
      nextItems.push(
        {
          type: "separator" as const,
        },
        {
          type: "text" as const,
          label: "Inspect Element",
          click: () => {
            tipcClient?.inspectElement({
              x: e.pageX,
              y: e.pageY,
            })
          },
        },
      )
    }
  }

  const unlisten = window.electron?.ipcRenderer.on("menu-click", (_, index) => {
    const item = nextItems[index]
    if (item && item.type === "text") {
      item.click?.()
    }
  })

  window.electron?.ipcRenderer.once("menu-closed", () => {
    unlisten?.()
    if (el instanceof HTMLElement) {
      delete el.dataset.contextMenuOpen
    }
  })

  await tipcClient?.showContextMenu({
    items: nextItems.map((item) => {
      if (item.type === "text") {
        return {
          ...item,
          enabled: item.enabled ?? item.click !== undefined,
          click: undefined,
        }
      }

      return item
    }),
  })
}

export const CONTEXT_MENU_SHOW_EVENT_KEY = "contextmenu-show"
