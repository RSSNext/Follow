import { produce } from "immer"
import { omit } from "lodash-es"
import { nanoid } from "nanoid"

import { whoami } from "~/atoms/user"
import { runTransactionInScope } from "~/database"
import { apiClient } from "~/lib/api-fetch"
import type {
  CombinedEntryModel,
  FeedModel,
  FeedOrListModel,
  FeedOrListRespModel,
  UserModel,
} from "~/models"
import { FeedService } from "~/services"

import { getSubscriptionByFeedId } from "../subscription"
import { userActions } from "../user"
import { createZustandStore } from "../utils/helper"
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
          if (
            feed.type === "feed" &&
            feed.errorAt &&
            new Date(feed.errorAt).getTime() > Date.now() - 1000 * 60 * 60 * 9
          ) {
            feed.errorAt = null
          }
          if (feed.id) {
            if (feed.owner) {
              userActions.upsert(feed.owner as UserModel)
            }
            if (feed.type === "feed" && feed.tipUsers) {
              userActions.upsert(feed.tipUsers)
            }

            // Not all API return these fields, so merging is needed here.
            const optionalFields = ["owner", "tipUsers"] as const
            optionalFields.forEach((field) => {
              if (state.feeds[feed.id!]?.[field] && !(field in feed)) {
                ;(feed as any)[field] = { ...state.feeds[feed.id!]?.[field] }
              }
            })

            state.feeds[feed.id] = omit(feed, "feeds") as FeedOrListModel
          } else {
            // Store temp feed in memory
            const nonce = feed["nonce"] || nanoid(8)
            state.feeds[nonce] = { ...feed, id: nonce }
          }
        }
      }),
    )
  }

  private patch(feedId: string, patch: Partial<FeedOrListRespModel>) {
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
    await apiClient.feeds.claim.challenge.$post({
      json: {
        feedId,
      },
    })
    runTransactionInScope(async () => {
      const currentUser = whoami()
      if (!currentUser) return
      this.updateFeedOwnership(feedId, currentUser.id)
      const feed = get().feeds[feedId]
      if (!feed) return
      await FeedService.upsert(feed)
    })
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

    const finalData = res.data.feed
    if (!finalData.id) {
      finalData["nonce"] = nonce
    }
    this.upsertMany([finalData])

    return {
      ...res.data,
      feed: !finalData.id ? { ...finalData, id: nonce } : finalData,
    }
  }
}
export const feedActions = new FeedActions()

export const getFeedById = (feedId: string): Nullable<FeedOrListRespModel> =>
  useFeedStore.getState().feeds[feedId]

export const getPreferredTitle = (
  feed?: FeedOrListRespModel | null,
  entry?: CombinedEntryModel["entries"],
) => {
  if (!feed?.id) {
    return feed?.title
  }

  if (feed.type === "inbox") {
    if (entry?.authorUrl) return entry.authorUrl.replace(/^mailto:/, "")
    return feed.title || `${feed.id.slice(0, 1).toUpperCase()}${feed.id.slice(1)}'s Inbox`
  }

  const subscription = getSubscriptionByFeedId(feed.id)
  return subscription?.title || feed.title
}
