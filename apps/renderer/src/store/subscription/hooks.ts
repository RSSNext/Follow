import { FeedViewType, viewList } from "@follow/constants"
import { useCallback, useMemo } from "react"

import { useGeneralSettingSelector } from "~/atoms/settings/general"

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

export const useViewWithSubscription = () =>
  useSubscriptionStore(
    useCallback((state) => {
      return viewList.filter((view) => {
        if (
          view === FeedViewType.Articles ||
          view === FeedViewType.SocialMedia ||
          view === FeedViewType.Pictures ||
          view === FeedViewType.Videos
        ) {
          return true
        } else {
          return state.feedIdByView[view].length > 0
        }
      })
    }, []),
  )

export const useCategories = () =>
  useSubscriptionStore(useCallback((state) => state.categories || [], []))

export const useCategoriesByView = (view: FeedViewType) =>
  useSubscriptionStore(
    useCallback(
      (state) =>
        new Set(
          subscriptionByViewSelector(view)(state)
            .map((subscription) => subscription?.category)
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

        const allSubscriptions = Object.values(store.data).filter(
          (subscription) => !subscription.listId && !subscription.inboxId,
        )

        for (const subscription of allSubscriptions) {
          const feed = feedTitleMap[subscription.feedId]
          if (feed) {
            feedInfo.push({ title: subscription.title || feed || "", id: subscription.feedId })
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
    useCallback(
      (store) => Object.values(store.data).filter((subscription) => subscription.listId),
      [],
    ),
  )
}

export const useAllInboxes = () => {
  return useSubscriptionStore(
    useCallback(
      (store) => Object.values(store.data).filter((subscription) => subscription.inboxId),
      [],
    ),
  )
}

export const useFeedsGroupedData = (view: FeedViewType) => {
  const data = useSubscriptionByView(view)

  const autoGroup = useGeneralSettingSelector((state) => state.autoGroup)

  return useMemo(() => {
    if (!data || data.length === 0) return {}

    const groupFolder = {} as Record<string, string[]>

    for (const subscription of data.filter((s) => !!s)) {
      const category =
        subscription.category || (autoGroup ? subscription.defaultCategory : subscription.feedId)

      if (category) {
        if (!groupFolder[category]) {
          groupFolder[category] = []
        }
        groupFolder[category].push(subscription.feedId)
      }
    }

    return groupFolder
  }, [autoGroup, data])
}

export const useListsGroupedData = (view: FeedViewType) => {
  const data = useSubscriptionByView(view)

  return useMemo(() => {
    if (!data || data.length === 0) return {}

    const lists = data.filter((s) => s && "listId" in s)

    const groupFolder = {} as Record<string, string[]>

    for (const subscription of lists.filter((s) => !!s)) {
      groupFolder[subscription.feedId] = [subscription.feedId]
    }

    return groupFolder
  }, [data])
}

export const useInboxesGroupedData = (view: FeedViewType) => {
  const data = useSubscriptionByView(view)

  return useMemo(() => {
    if (!data || data.length === 0) return {}

    const inboxes = data.filter((s) => s && "inboxId" in s)

    const groupFolder = {} as Record<string, string[]>

    for (const subscription of inboxes.filter((s) => !!s)) {
      if (!subscription.inboxId) continue
      groupFolder[subscription.inboxId] = [subscription.inboxId]
    }

    return groupFolder
  }, [data])
}
