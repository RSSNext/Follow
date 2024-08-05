import { get } from "lodash-es"

import { tipcClient } from "./client"

export type NativeMenuItem =
  | {
    type: "text"
    label: string
    click?: () => void
    enabled?: boolean
    /** only work in web app */
    icon?: React.ReactNode
    shortcut?: string
    disabled?: boolean
    submenu?: NativeMenuItem[]
  }
  | { type: "separator", disabled?: boolean }

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

  const unlisten = window.electron?.ipcRenderer.on(
    "menu-click",
    (_, combinedIndex: string) => {
      const arr = combinedIndex.split("-")
      const accessors = [] as string[]
      for (let i = 0; i < arr.length; i++) {
        accessors.push(arr[i])

        if (i !== arr.length - 1) {
          accessors.push("submenu")
        }
      }
      const item = get(nextItems, accessors)

      if (item && item.type === "text") {
        item.click?.()
      }
    },
  )

  window.electron?.ipcRenderer.once("menu-closed", () => {
    unlisten?.()
    if (el instanceof HTMLElement) {
      delete el.dataset.contextMenuOpen
    }
  })

  await tipcClient?.showContextMenu({
    items: transformMenuItems(nextItems),
  })

  function transformMenuItems(nextItems: NativeMenuItem[]) {
    return nextItems.map((item) => {
      if (item.type === "text") {
        return {
          ...item,
          icon: undefined,
          enabled: item.enabled ?? (item.click !== undefined || !!item.submenu),
          click: undefined,
          submenu: item.submenu ? transformMenuItems(item.submenu) : undefined,
        }
      }
      return item
    })
  }
}

export const CONTEXT_MENU_SHOW_EVENT_KEY = "contextmenu-show"
