import { buildStorageNS } from "@renderer/lib/ns"

import { createZustandStore, getStoreActions, localStorage } from "./utils/helper"

interface UIState {
  entryColWidth: number
  opaqueSidebar: boolean
  readerFontFamily: string
  uiTextSize: number

  // Display counts
  /** macOS only */
  showDockBadge: boolean
  sidebarShowUnreadCount: boolean
}

const createDefaultUIState = (): UIState => ({
  entryColWidth: 340,
  opaqueSidebar: false,
  readerFontFamily: "SN Pro",
  uiTextSize: 16,

  showDockBadge: true,
  sidebarShowUnreadCount: true,
})
interface UIActions {
  clear: () => void
  set: <T extends keyof UIState>(key: T, value: UIState[T]) => void
}
export const useUIStore = createZustandStore<UIState & UIActions>(buildStorageNS("ui"), {
  version: 1,
  storage: localStorage,
})((set) => ({
  ...createDefaultUIState(),

  clear() {
    set(createDefaultUIState())
  },
  set(key, value) {
    set({ [key]: value })
  },
}))

export const uiActions = getStoreActions(useUIStore)
