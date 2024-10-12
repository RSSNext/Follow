import { FEED_COLLECTION_LIST, ROUTE_FEED_IN_FOLDER } from "~/constants"
import type { FeedViewType } from "~/lib/enum"

import { subscriptionCategoryExistSelector, useSubscriptionStore } from "../subscription"

type FeedId = string
export const useFeedIdByView = (view: FeedViewType) =>
  useSubscriptionStore((state) => state.feedIdByView[view] || [])

export const useCategoryOpenStateByView = (view: FeedViewType) =>
  useSubscriptionStore((state) => state.categoryOpenStateByView[view])

export const useSubscriptionByView = (view: FeedViewType) =>
  useSubscriptionStore((state) => state.feedIdByView[view].map((id) => state.data[id]))

export const useSubscriptionByFeedId = (feedId: FeedId) =>
  useSubscriptionStore((state) => state.data[feedId])

export const useFolderFeedsByFeedId = ({ feedId, view }: { feedId?: string; view: FeedViewType }) =>
  useSubscriptionStore((state): string[] | null => {
    if (typeof feedId !== "string") return null
    if (feedId === FEED_COLLECTION_LIST) {
      return [feedId]
    }

    if (!feedId.startsWith(ROUTE_FEED_IN_FOLDER)) {
      return null
    }

    const folderName = feedId.replace(ROUTE_FEED_IN_FOLDER, "")
    const feedIds: string[] = []
    for (const feedId in state.data) {
      const subscription = state.data[feedId]
      if (
        subscription.view === view &&
        (subscription.category === folderName || subscription.defaultCategory === folderName)
      ) {
        feedIds.push(feedId)
      }
    }
    return feedIds
  })

export const useSubscriptionCategoryExist = (name: string) =>
  useSubscriptionStore(subscriptionCategoryExistSelector(name))
