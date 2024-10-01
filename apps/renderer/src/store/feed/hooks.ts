import { useMutation } from "@tanstack/react-query"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useShallow } from "zustand/react/shallow"

import { FEED_COLLECTION_LIST, ROUTE_FEED_IN_FOLDER, ROUTE_FEED_PENDING, views } from "~/constants"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { apiClient } from "~/lib/api-fetch"
import type { FeedOrListRespModel } from "~/models"

import { listActions } from "../list"
import { getSubscriptionByFeedId } from "../subscription"
import { useFeedStore } from "./store"
import type { FeedQueryParams } from "./types"

export const useFeedById = (feedId: Nullable<string>): FeedOrListRespModel | null =>
  useFeedStore((state) => (feedId ? state.feeds[feedId] : null))

export const useFeedByIdOrUrl = (feed: FeedQueryParams) =>
  useFeedStore((state) => {
    if (feed.id) {
      return state.feeds[feed.id]
    }
    if (feed.url) {
      return Object.values(state.feeds).find((f) => f.type === "feed" && f.url === feed.url) || null
    }
    return null
  })

export const useFeedByIdSelector = <T>(
  feedId: Nullable<string>,
  selector: (feed: FeedOrListRespModel) => T,
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

export const useAddFeedToFeedList = (options?: {
  onSuccess?: () => void
  onError?: () => void
}) => {
  const { t } = useTranslation("settings")
  return useMutation({
    mutationFn: async (
      payload: { feedId: string; listId: string } | { feedIds: string[]; listId: string },
    ) => {
      const feeds = await apiClient.lists.feeds.$post({
        json: payload,
      })

      feeds.data.forEach((feed) => listActions.addFeedToFeedList(payload.listId, feed))
    },
    onSuccess: () => {
      toast.success(t("lists.feeds.add.success"))

      options?.onSuccess?.()
    },
    async onError() {
      toast.error(t("lists.feeds.add.error"))
      options?.onError?.()
    },
  })
}

export const useRemoveFeedFromFeedList = (options?: {
  onSuccess: () => void
  onError: () => void
}) => {
  const { t } = useTranslation("settings")
  return useMutation({
    mutationFn: async (payload: { feedId: string; listId: string }) => {
      listActions.removeFeedFromFeedList(payload.listId, payload.feedId)
      await apiClient.lists.feeds.$delete({
        json: {
          listId: payload.listId,
          feedId: payload.feedId,
        },
      })
    },
    onSuccess: () => {
      toast.success(t("lists.feeds.delete.success"))
      options?.onSuccess?.()
    },
    async onError() {
      toast.error(t("lists.feeds.delete.error"))
      options?.onError?.()
    },
  })
}
