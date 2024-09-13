import {
  FEED_COLLECTION_LIST,
  ROUTE_FEED_IN_FOLDER,
  ROUTE_FEED_PENDING,
  views,
} from "@renderer/constants"
import { useRouteParms } from "@renderer/hooks/biz/useRouteParams"
import type { FeedModel } from "@renderer/models"
import { useMemo } from "react"
import { useShallow } from "zustand/react/shallow"

import { getSubscriptionByFeedId } from "../subscription"
import { useFeedStore } from "./store"
import type { FeedQueryParams } from "./types"

export const useFeedById = (feedId: Nullable<string>): FeedModel | null =>
  useFeedStore((state) => (feedId ? state.feeds[feedId] : null))

export const useFeedByIdOrUrl = (feed: FeedQueryParams) =>
  useFeedStore((state) => {
    if (feed.id) {
      return state.feeds[feed.id]
    }
    if (feed.url) {
      return Object.values(state.feeds).find((f) => f.url === feed.url) || null
    }
    return null
  })

export const useFeedByIdSelector = <T>(
  feedId: Nullable<string>,
  selector: (feed: FeedModel) => T,
) =>
  useFeedStore(
    useShallow((state) => (feedId && state.feeds[feedId] ? selector(state.feeds[feedId]) : null)),
  )

export const useFeedHeaderTitle = () => {
  const { feedId: currentFeedId, view } = useRouteParms()

  const feedTitle = useFeedByIdSelector(currentFeedId, (feed) => feed.title)
  const subscriptionTitle = useMemo(
    () => (currentFeedId ? (getSubscriptionByFeedId(currentFeedId)?.title ?? "") : ""),
    [currentFeedId],
  )

  switch (currentFeedId) {
    case ROUTE_FEED_PENDING: {
      return views[view].name
    }
    case FEED_COLLECTION_LIST: {
      return "Starred"
    }
    default: {
      if (currentFeedId?.startsWith(ROUTE_FEED_IN_FOLDER)) {
        return currentFeedId.replace(ROUTE_FEED_IN_FOLDER, "")
      }
      return subscriptionTitle || feedTitle
    }
  }
}
