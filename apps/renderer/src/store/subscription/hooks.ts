import type { FeedViewType } from "@follow/constants"
import { useCallback } from "react"

import { useFeedStore } from "../feed"
import {
  categoryOpenStateByViewSelector,
  feedIdByViewSelector,
  feedSubscriptionCountSelector,
  folderFeedsByFeedIdSelector,
  inboxSubscriptionCountSelector,
  listSubscriptionCountSelector,
  subscriptionByFeedIdSelector,
  subscriptionByViewSelector,
  subscriptionCategoryExistSelector,
  subscriptionsByFeedIsdSelector,
} from "./selector"
import type { SubscriptionFlatModel } from "./store"
import { useSubscriptionStore } from "./store"

type FeedId = string

export const useFeedIdByView = (view: FeedViewType) =>
  useSubscriptionStore(useCallback((state) => feedIdByViewSelector(view)(state) || [], [view]))

export const useCategoryOpenStateByView = (view: FeedViewType) =>
  useSubscriptionStore(
    useCallback((state) => categoryOpenStateByViewSelector(view)(state) || {}, [view]),
  )

export const useSubscriptionByView = (view: FeedViewType) =>
  useSubscriptionStore(
    useCallback((state) => subscriptionByViewSelector(view)(state) || [], [view]),
  )

export const useCategories = () =>
  useSubscriptionStore(useCallback((state) => state.categories || [], []))

export const useCategoriesByView = (view: FeedViewType) =>
  useSubscriptionStore(
    useCallback(
      (state) =>
        new Set(
          subscriptionByViewSelector(view)(state)
            .map((subscription) => subscription!.category)
            .filter((category) => category !== null && category !== undefined)
            .filter(Boolean),
        ),
      [view],
    ),
  )

export const useSubscriptionByFeedId = (feedId: FeedId) =>
  useSubscriptionStore(
    useCallback((state) => subscriptionByFeedIdSelector(feedId)(state) || null, [feedId]),
  )
export const useSubscriptionsByFeedIds = (feedIds: FeedId[]) =>
  useSubscriptionStore(
    useCallback((state) => subscriptionsByFeedIsdSelector(feedIds)(state) || null, [feedIds]),
  )

export const useFolderFeedsByFeedId = ({ feedId, view }: { feedId?: string; view: FeedViewType }) =>
  useSubscriptionStore(
    useCallback(
      (state) => folderFeedsByFeedIdSelector({ feedId, view })(state) || [],
      [feedId, view],
    ),
  )

export const useListSubscriptionCount = () => useSubscriptionStore(listSubscriptionCountSelector)

export const useInboxSubscriptionCount = () => useSubscriptionStore(inboxSubscriptionCountSelector)

export const useFeedSubscriptionCount = () => useSubscriptionStore(feedSubscriptionCountSelector)

export const useSubscriptionCategoryExist = (name: string) =>
  useSubscriptionStore(
    useCallback((state) => subscriptionCategoryExistSelector(name)(state), [name]),
  )

export const useAllFeeds = () => {
  const feedTitleMap = useFeedStore(
    useCallback((store) => {
      return Object.fromEntries(Object.entries(store.feeds).map(([id, feed]) => [id, feed.title]))
    }, []),
  )
  return useSubscriptionStore(
    useCallback(
      (store) => {
        const feedInfo = [] as { title: string; id: string }[]

        const allSubscriptions = Object.values(store.feedIdByView).flat()

        for (const feedId of allSubscriptions) {
          const subscription = store.data[feedId]!
          const feed = feedTitleMap[feedId]
          if (feed) {
            feedInfo.push({ title: subscription.title || feed || "", id: feedId })
          }
        }
        return feedInfo
      },
      [feedTitleMap],
    ),
  )
}

export const useAllLists = () => {
  return useSubscriptionStore(
    useCallback((store) => {
      const lists = [] as SubscriptionFlatModel[]

      const allSubscriptions = Object.values(store.feedIdByView).flat()

      for (const feedId of allSubscriptions) {
        const subscription = store.data[feedId]!
        if (subscription.listId) {
          lists.push(subscription)
        }
      }
      return lists
    }, []),
  )
}

export const useAllInboxes = () => {
  return useSubscriptionStore(
    useCallback((store) => {
      const inboxes = [] as SubscriptionFlatModel[]

      const allSubscriptions = Object.values(store.feedIdByView).flat()

      for (const feedId of allSubscriptions) {
        const subscription = store.data[feedId]!
        if (subscription.inboxId) {
          inboxes.push(subscription)
        }
      }
      return inboxes
    }, []),
  )
}
