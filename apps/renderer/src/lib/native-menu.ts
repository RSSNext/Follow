import { IN_ELECTRON } from "@follow/shared/constants"
import { get } from "lodash-es"

import { tipcClient } from "./client"
import { getOS } from "./utils"

export type NativeMenuItem = (
  | {
      type: "text"
      label: string
      click?: () => void
      /** only work in web app */
      icon?: React.ReactNode
      shortcut?: string
      disabled?: boolean
      submenu?: NativeMenuItem[]
      checked?: boolean
    }
  | { type: "separator"; disabled?: boolean }
) & { hide?: boolean }

export type NullableNativeMenuItem = NativeMenuItem | null | undefined | false | ""

function sortShortcutsString(shortcut: string) {
  const order = ["Shift", "Ctrl", "Meta", "Alt"]
  let nextShortcut = shortcut
  if (getOS() === "Windows") {
    nextShortcut = shortcut.replace("Meta", "Ctrl").replace("meta", "ctrl")
  }
  const arr = nextShortcut.split("+")

  const sortedModifiers = arr
    .filter((key) => order.includes(key))
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))

  const otherKeys = arr.filter((key) => !order.includes(key))

  return [...sortedModifiers, ...otherKeys].join("+")
}
export const showNativeMenu = async (
  items: Array<NullableNativeMenuItem>,
  e?: MouseEvent | React.MouseEvent,
) => {
  const nextItems = (items.filter((item) => item && !item.hide) as NativeMenuItem[]).map((item) => {
    if (item.type === "text") {
      return {
        ...item,
        shortcut: item.shortcut ? sortShortcutsString(item.shortcut) : undefined,
      }
    }
    return item
  }) as NativeMenuItem[]

  const el = e && e.currentTarget

  if (el instanceof HTMLElement) {
    el.dataset.contextMenuOpen = "true"
  }

  // only show native menu on macOS electron, because in other platform, the native ui is not good
  if (!IN_ELECTRON || getOS() !== "macOS") {
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

  const dispose = window.electron?.ipcRenderer.on("menu-click", (_, combinedIndex: string) => {
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
  })

  window.electron?.ipcRenderer.once("menu-closed", () => {
    dispose?.()
    if (el instanceof HTMLElement) {
      delete el.dataset.contextMenuOpen
    }

    // dispatch mouse move event
    // NOTE: in order to remove the highlight of the trigger item
    // e.g. https://vscode.dev/github/RSSNext/follow/blob/dev/apps/renderer/src/modules/entry-column/layouts/EntryItemWrapper.tsx#L80
    document.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))
  })

  await tipcClient?.showContextMenu({
    items: transformMenuItemsForNative(nextItems),
  })

  function transformMenuItemsForNative(nextItems: NativeMenuItem[]) {
    return nextItems.map((item) => {
      if (item.type === "text") {
        return {
          ...item,
          icon: undefined,
          enabled: item.click !== undefined || (!!item.submenu && item.submenu.length > 0),
          click: undefined,
          submenu: item.submenu ? transformMenuItemsForNative(item.submenu) : undefined,
          shortcut: item.shortcut?.replace("Meta", "CmdOrCtrl"),
        }
      }
      return item
    })
  }
}

export const CONTEXT_MENU_SHOW_EVENT_KEY = "contextmenu-show"
