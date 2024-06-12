import { createZustandStore, getStoreActions } from "./utils/helper"

interface UIState {
  entryColWidth: number
}

const createDefaultUIState = (): UIState => ({
  entryColWidth: 340,
})
interface UIActions {
  setEntryColWidth: (width: number) => void

  clear: () => void
}
export const useUIStore = createZustandStore<UIState & UIActions>("ui", {
  version: 0,
})((set) => ({
  ...createDefaultUIState(),

  clear() {
    set(createDefaultUIState())
  },

  setEntryColWidth(width) {
    set({ entryColWidth: width })
  },
}))

export const uiActions = getStoreActions(useUIStore)
