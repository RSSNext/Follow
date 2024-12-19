import type { FeedModel } from "@/src/database/schemas/types"

import { createImmerSetter, createZustandStore } from "../internal/helper"

interface FeedState {
  feeds: Record<string, FeedModel>
}

export const useFeedStore = createZustandStore<FeedState>("feed")(() => ({
  feeds: {},
}))

const set = useFeedStore.setState
const immerSet = createImmerSetter(useFeedStore)
const get = useFeedStore.getState
const distanceTime = 1000 * 60 * 60 * 9
class FeedActions {
  clear() {
    set({ feeds: {} })
  }

  upsertMany(feeds: FeedModel[]) {
    immerSet((draft) => {
      for (const feed of feeds) {
        draft.feeds[feed.id] = feed
      }
    })
  }

  private patch(feedId: string, patch: Partial<FeedModel>) {
    // set((state) =>
    //   produce(state, (state) => {
    //     const feed = state.feeds[feedId]
    //     if (!feed) return

    //     Object.assign(feed, patch)
    //   }),
    // )
    immerSet((state) => {
      const feed = state.feeds[feedId]
      if (!feed) return
      Object.assign(feed, patch)
    })
  }
}
export const feedActions = new FeedActions()
