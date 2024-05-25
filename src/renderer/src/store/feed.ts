import type { ActiveEntry, ActiveList } from "@renderer/lib/types"
import { create } from "zustand"

interface FeedStoreActions {
  setActiveList: ((value: ActiveList) => void) | undefined
  setActiveEntry: (value: ActiveEntry) => void
}
interface FeedStoreState {
  activeList: ActiveList
  activeEntry: ActiveEntry
}

type FeedStore = FeedStoreState & { actions: Readonly<FeedStoreActions> }
export const useFeedStore = create<FeedStore>((set) => ({
  activeList: {
    level: "view",
    id: 0,
    name: "Articles",
    view: 0,
  },
  activeEntry: null,

  // Actions

  actions: {
    setActiveEntry: (value) => set({ activeEntry: value }),
    setActiveList: (value) => set({ activeList: value }),
  },
}))

export const feedActions = useFeedStore.getState().actions

/** Hooks */
export const useFeedActiveList = () => useFeedStore((state) => state.activeList)
