import type { FeedSchema } from "@/src/database/schemas/types"
import { FeedService } from "@/src/services/feed"

import { createImmerSetter, createTransaction, createZustandStore } from "../internal/helper"

interface FeedState {
  feeds: Record<string, FeedSchema>
}

export const useFeedStore = createZustandStore<FeedState>("feed")(() => ({
  feeds: {},
}))

const set = useFeedStore.setState
const immerSet = createImmerSetter(useFeedStore)
// const get = useFeedStore.getState
// const distanceTime = 1000 * 60 * 60 * 9
class FeedActions {
  clear() {
    set({ feeds: {} })
  }

  upsertMany(feeds: FeedSchema[]) {
    if (feeds.length === 0) return

    const tx = createTransaction()
    tx.store(() => {
      immerSet((draft) => {
        for (const feed of feeds) {
          draft.feeds[feed.id] = feed
        }
      })
    })

    tx.persist(async () => {
      await FeedService.upsertMany(feeds)
    })

    tx.run()
  }

  private patch(feedId: string, patch: Partial<FeedSchema>) {
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
