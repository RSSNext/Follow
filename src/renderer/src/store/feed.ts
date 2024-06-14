import type { ActiveEntryId, ActiveList } from "@renderer/models"
import { create } from "zustand"

import { getStoreActions } from "./utils/helper"

interface FeedStoreActions {
  setActiveList: (value: ActiveList) => void
  setActiveEntry: (value: ActiveEntryId) => void
}
interface FeedStoreState {
  activeList: ActiveList
  activeEntryId: ActiveEntryId
}

type FeedStore = FeedStoreState & Readonly<FeedStoreActions>
export const useFeedStore = create<FeedStore>((set) => ({
  activeList: {
    level: "view",
    id: 0,
    name: "Articles",
    view: 0,
  },
  activeEntryId: null,
  activeEntryIndex: null,

  // Actions
  setActiveEntry: (value) => set({ activeEntryId: value }),
  setActiveList: (value) => set({ activeList: value }),
}))

export const feedActions = getStoreActions(useFeedStore)

export const getCurrentFeedId = () => useFeedStore.getState().activeList.id
export const getCurrentEntryId = () => useFeedStore.getState().activeEntryId

/** Hooks */
export const useFeedActiveList = () =>
  useFeedStore((state) => state.activeList)
