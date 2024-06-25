import { buildStorageNS } from "@renderer/lib/ns"

import {
  createZustandStore,
  getStoreActions,
  localStorage,
} from "./utils/helper"

interface UIState {
  entryColWidth: number
  opaqueSidebar: boolean
  readerFontFamily: string
  uiTextSize: number

  // Display counts
  /** macOS only */
  showDockBadge: boolean
  sidebarShowUnreadCount: boolean

  // modal
  modalOverlay: boolean
  modalDraggable: boolean
}

const createDefaultUIState = (): UIState => ({
  entryColWidth: 340,
  opaqueSidebar: false,
  readerFontFamily: "SN Pro",
  uiTextSize: 16,

  showDockBadge: true,
  sidebarShowUnreadCount: true,

  modalOverlay: true,
  modalDraggable: true,
})
interface UIActions {
  clear: () => void
  set: <T extends keyof UIState>(key: T, value: UIState[T]) => void
}
const storageKey = buildStorageNS("ui")
export const useUIStore = createZustandStore<UIState & UIActions>(storageKey, {
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
