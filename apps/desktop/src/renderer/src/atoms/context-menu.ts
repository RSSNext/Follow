import { IN_ELECTRON } from "@follow/shared/constants"
import { getOS, transformShortcut } from "@follow/utils/utils"
import { atom } from "jotai"
import { useCallback } from "react"

import { tipcClient } from "~/lib/client"
import { createAtomHooks } from "~/lib/jotai"
import type { ElectronMenuItem } from "~/lib/native-menu"
import { showElectronContextMenu } from "~/lib/native-menu"

// Atom

type ContextMenuState =
  | { open: false }
  | {
      open: true
      position: { x: number; y: number }
      menuItems: FollowMenuItem[]
      // Just for abort callback
      // Also can be optimized by using the `atomWithListeners`
      abortController: AbortController
    }

export const [contextMenuAtom, useContextMenuState, useContextMenuValue, useSetContextMenu] =
  createAtomHooks(atom<ContextMenuState>({ open: false }))

const useShowWebContextMenu = () => {
  const setContextMenu = useSetContextMenu()

  const showWebContextMenu = useCallback(
    async (menuItems: Array<FollowMenuItem>, e: MouseEvent | React.MouseEvent) => {
      const abortController = new AbortController()
      const resolvers = Promise.withResolvers<void>()
      setContextMenu({
        open: true,
        position: { x: e.clientX, y: e.clientY },
        menuItems,
        abortController,
      })

      abortController.signal.addEventListener("abort", () => {
        resolvers.resolve()
      })
      return resolvers.promise
    },
    [setContextMenu],
  )

  return showWebContextMenu
}

// Menu

export type BaseMenuItemText = {
  type: "text"
  label: string
  click?: () => void
  /** only work in web app */
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  checked?: boolean
  supportMultipleSelection?: boolean
}

type BaseMenuItemSeparator = {
  type: "separator"
  disabled?: boolean
}

type BaseMenuItem = BaseMenuItemText | BaseMenuItemSeparator

export type FollowMenuItem = BaseMenuItem & {
  submenu?: FollowMenuItem[]
}

export type MenuItemInput =
  | (BaseMenuItemText & { hide?: boolean; submenu?: MenuItemInput[] })
  | (BaseMenuItemSeparator & { hide?: boolean })
  | null
  | undefined
  | false
  | ""

function sortShortcutsString(shortcut: string) {
  const order = ["Shift", "Ctrl", "Meta", "Alt"]
  const nextShortcut = transformShortcut(shortcut)

  const arr = nextShortcut.split("+")

  const sortedModifiers = arr
    .filter((key) => order.includes(key))
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))

  const otherKeys = arr.filter((key) => !order.includes(key))

  return [...sortedModifiers, ...otherKeys].join("+")
}

function normalizeMenuItems(items: MenuItemInput[]): FollowMenuItem[] {
  return items
    .filter((item) => item !== null && item !== undefined && item !== false && item !== "")
    .filter((item) => !item.hide)
    .map((item) => {
      if (item.type === "separator") {
        return item
      }

      return {
        ...item,
        shortcut: item.shortcut ? sortShortcutsString(item.shortcut) : undefined,
        submenu: item.submenu ? normalizeMenuItems(item.submenu) : undefined,
      }
    })
}

// MenuItem must have at least one of label, role or type
function transformMenuItemsForNative(nextItems: FollowMenuItem[]): ElectronMenuItem[] {
  return nextItems.map((item) => {
    if (item.type === "separator") {
      return { type: "separator" }
    }
    return {
      type: typeof item.checked === "boolean" ? "checkbox" : undefined,
      label: item.label,
      click: item.click,
      enabled:
        (!item.disabled && item.click !== undefined) || (!!item.submenu && item.submenu.length > 0),
      accelerator: item.shortcut?.replace("Meta", "CmdOrCtrl"),
      checked: typeof item.checked === "boolean" ? item.checked : undefined,
      submenu: item.submenu ? transformMenuItemsForNative(item.submenu) : undefined,
    }
  })
}

function withDebugMenu(menuItems: Array<FollowMenuItem>, e: MouseEvent | React.MouseEvent) {
  if (import.meta.env.DEV && e) {
    menuItems.push(
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
  return menuItems
}

export const useShowContextMenu = () => {
  const showWebContextMenu = useShowWebContextMenu()

  const showContextMenu = useCallback(
    async (inputMenu: Array<MenuItemInput>, e: MouseEvent | React.MouseEvent) => {
      const menuItems = normalizeMenuItems(inputMenu)
      // only show native menu on macOS electron, because in other platform, the native ui is not good
      if (IN_ELECTRON && getOS() === "macOS") {
        withDebugMenu(menuItems, e)
        await showElectronContextMenu(transformMenuItemsForNative(menuItems))
        return
      }
      await showWebContextMenu(menuItems, e)
    },
    [showWebContextMenu],
  )

  return showContextMenu
}
