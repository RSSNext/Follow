import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useShallow } from "zustand/react/shallow"

import { FEED_COLLECTION_LIST, ROUTE_FEED_IN_FOLDER, ROUTE_FEED_PENDING, views } from "~/constants"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import type { FeedModel } from "~/models"

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
  const { t } = useTranslation()

  const { feedId: currentFeedId, view } = useRouteParams()

  const feedTitle = useFeedByIdSelector(currentFeedId, (feed) => feed.title)
  const subscriptionTitle = useMemo(
    () => (currentFeedId ? (getSubscriptionByFeedId(currentFeedId)?.title ?? "") : ""),
    [currentFeedId],
  )

  switch (currentFeedId) {
    case ROUTE_FEED_PENDING: {
      // TODO: fix this type error
      return t(views[view].name)
    }
    case FEED_COLLECTION_LIST: {
      return t("words.starred")
    }
    default: {
      if (currentFeedId?.startsWith(ROUTE_FEED_IN_FOLDER)) {
        return currentFeedId.replace(ROUTE_FEED_IN_FOLDER, "")
      }
      return subscriptionTitle || feedTitle
    }
  }
}
