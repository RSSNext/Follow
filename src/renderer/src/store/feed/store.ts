import { whoami } from "@renderer/atoms/user"
import { runTransactionInScope } from "@renderer/database"
import { apiClient } from "@renderer/lib/api-fetch"
import type { FeedModel } from "@renderer/models"
import { FeedService } from "@renderer/services"
import { produce } from "immer"
import { nanoid } from "nanoid"

import { getSubscriptionByFeedId } from "../subscription"
import { createZustandStore, doMutationAndTransaction } from "../utils/helper"
import type { FeedQueryParams, FeedState } from "./types"

export const useFeedStore = createZustandStore<FeedState>("feed")(() => ({
  feeds: {},
}))

const set = useFeedStore.setState
const get = useFeedStore.getState
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
          if (feed.errorAt && new Date(feed.errorAt).getTime() > Date.now() - 1000 * 60 * 60 * 9) {
            feed.errorAt = null
          }
          if (feed.id) {
            state.feeds[feed.id] = feed
          } else {
            // Store temp feed in memory
            const nonce = nanoid(8)
            state.feeds[nonce] = { ...feed, id: nonce }
          }
        }
      }),
    )
  }

  private patch(feedId: string, patch: Partial<FeedModel>) {
    set((state) =>
      produce(state, (state) => {
        const feed = state.feeds[feedId]
        if (!feed) return

        Object.assign(feed, patch)
      }),
    )
  }

  updateFeedOwnership(feedId: string, ownerUserId: string | null) {
    this.patch(feedId, {
      ownerUserId,
    })
  }

  async claimFeed(feedId: string) {
    await doMutationAndTransaction(
      () =>
        apiClient.feeds.claim.challenge.$post({
          json: {
            feedId,
          },
        }),

      async () => {
        const currentUser = whoami()
        if (!currentUser) return
        this.updateFeedOwnership(feedId, currentUser.id)
        const feed = get().feeds[feedId]
        if (!feed) return
        await FeedService.upsert(feed)
      },
      { doTranscationWhenMutationFail: false, waitMutation: true },
    )
  }

  // API Fetcher
  //

  async fetchFeedById({ id, url }: FeedQueryParams) {
    const res = await apiClient.feeds.$get({
      query: {
        id,
        url,
      },
    })

    const nonce = nanoid(8)

    const finalData = {
      ...res.data.feed,
      id: id || res.data.feed.id || nonce,
    }
    this.upsertMany([finalData])

    return {
      ...res.data,
      feed: finalData,
    }
  }
}
export const feedActions = new FeedActions()

export const getFeedById = (feedId: string): Nullable<FeedModel> =>
  useFeedStore.getState().feeds[feedId]

export const getPreferredTitle = (feed?: FeedModel | null) => {
  if (!feed?.id) {
    return feed?.title
  }

  const subscription = getSubscriptionByFeedId(feed.id)
  return subscription?.title || feed.title
}
