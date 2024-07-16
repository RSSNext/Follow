import { runTransactionInScope } from "@renderer/database"
import type { FeedModel } from "@renderer/models"
import { FeedService } from "@renderer/services"
import { produce } from "immer"

import { createZustandStore } from "../utils/helper"
import type { FeedState } from "./types"

export const useFeedStore = createZustandStore<FeedState >(
  "feed",

)(() => ({
  feeds: {},
}))

const set = useFeedStore.setState
// const get = useFeedStore.getState
class FeedActions {
  clear() {
    set({ feeds: {} })
  }

  upsertMany(feeds: FeedModel[]) {
    runTransactionInScope(() => {
      FeedService.upsertMany(feeds)
    })
    set((state) =>
      produce(state, (state) => {
        for (const feed of feeds) {
          if (feed.id) {
            state.feeds[feed.id] = feed
          }
        }
      }),
    )
  }

  patch(feedId: string, patch: Partial<FeedModel>) {
    set((state) =>
      produce(state, (state) => {
        const feed = state.feeds[feedId]
        if (!feed) return

        Object.assign(feed, patch)
      }),
    )
  }
}
export const feedActions = new FeedActions()

export const getFeedById = (feedId: string): Nullable<FeedModel> =>
  useFeedStore.getState().feeds[feedId]
