import type { FeedModel } from "@renderer/models"
import { produce } from "immer"

import { createZustandStore, getStoreActions } from "../utils/helper"
import type { FeedActions, FeedState } from "./types"

export const useFeedStore = createZustandStore<FeedState & FeedActions>(
  "feed",
  {
    version: 1,
  },
)((set) => ({
  feeds: {},
  clear() {
    set({ feeds: {} })
  },
  upsertMany(feeds) {
    set((state) =>
      produce(state, (state) => {
        for (const feed of feeds) {
          if (feed.id) { state.feeds[feed.id] = feed }
        }
      }),
    )
  },

  optimisticUpdate(feedId, changed) {
    set((state) =>
      produce(state, (state) => {
        const feed = state.feeds[feedId]
        if (!feed) return

        Object.assign(feed, changed)
      }),
    )
  },
}))
export const feedActions = getStoreActions(useFeedStore)

export const getFeedById = (feedId: string): Nullable<FeedModel> => useFeedStore.getState().feeds[feedId]
