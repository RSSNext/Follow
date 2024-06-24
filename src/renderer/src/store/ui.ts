import { createZustandStore, getStoreActions } from "./utils/helper"

interface UIState {
  entryColWidth: number
  opaqueSidebar: boolean
  readerFontFamily: string
  uiTextSize: number
  /** macOS only */
  showDockBadge: boolean
}

const createDefaultUIState = (): UIState => ({
  entryColWidth: 340,
  opaqueSidebar: false,
  readerFontFamily: "SN Pro",
  uiTextSize: 16,

  showDockBadge: true,
})
interface UIActions {
  clear: () => void
  set: <T extends keyof UIState>(key: T, value: UIState[T]) => void
}
export const useUIStore = createZustandStore<UIState & UIActions>("ui", {
  version: 1,
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
