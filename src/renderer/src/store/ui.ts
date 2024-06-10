import { createZustandStore, getStoreActions } from "./utils/helper"

interface UIState {
  entryColWidth: number
}
interface UIActions {
  setEntryColWidth: (width: number) => void
}
export const useUIStore = createZustandStore<UIState & UIActions>(
  "ui",
  {
    version: 0,
  },
)((set) => ({
  entryColWidth: 450,
  setEntryColWidth(width) {
    set({ entryColWidth: width })
  },
}))

export const uiActions = getStoreActions(useUIStore)
