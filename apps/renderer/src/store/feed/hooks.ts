import { views } from "@follow/constants"
import type { FeedOrListRespModel, InboxModel, ListModel } from "@follow/models/types"
import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useShallow } from "zustand/react/shallow"

import { FEED_COLLECTION_LIST, ROUTE_FEED_IN_FOLDER, ROUTE_FEED_PENDING } from "~/constants"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { apiClient } from "~/lib/api-fetch"

import { useInboxStore } from "../inbox"
import { listActions, useListStore } from "../list"
import { getPreferredTitle, useFeedStore } from "./store"
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

export const useListByIdSelector = <T>(
  listId: Nullable<string>,
  selector: (list: ListModel) => T,
) =>
  useListStore(
    useShallow((state) => (listId && state.lists[listId] ? selector(state.lists[listId]) : null)),
  )

export const useInboxByIdSelector = <T>(
  inboxId: Nullable<string>,
  selector: (inbox: InboxModel) => T,
) =>
  useInboxStore(
    useShallow((state) =>
      inboxId && state.inboxes[inboxId] ? selector(state.inboxes[inboxId]) : null,
    ),
  )

export const useFeedHeaderTitle = () => {
  const { t } = useTranslation()

  const { feedId: currentFeedId, view, listId, inboxId } = useRouteParams()

  const listTitle = useListByIdSelector(listId, (list) => getPreferredTitle(list))
  const inboxTitle = useInboxByIdSelector(inboxId, (inbox) => getPreferredTitle(inbox))
  const feedTitle = useFeedByIdSelector(currentFeedId, (feed) => getPreferredTitle(feed))

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
      return feedTitle || listTitle || inboxTitle
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
