import { views } from "@follow/constants"
import type { FeedModel, FeedOrListRespModel, InboxModel, ListModel } from "@follow/models/types"
import { useMutation } from "@tanstack/react-query"
import { useCallback, useRef } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { FEED_COLLECTION_LIST, ROUTE_FEED_IN_FOLDER, ROUTE_FEED_PENDING } from "~/constants"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { apiClient } from "~/lib/api-fetch"
import { entries } from "~/queries/entries"

import { useInboxStore } from "../inbox"
import { listActions, useListStore } from "../list"
import {
  feedByIdOrUrlSelector,
  feedByIdSelector,
  feedByIdSelectorWithTransform,
  feedByIdWithTransformSelector,
  inboxByIdSelectorWithTransform,
  listByIdSelectorWithTransform,
} from "./selector"
import { getPreferredTitle, useFeedStore } from "./store"
import type { FeedQueryParams } from "./types"

export function useFeedById(feedId: Nullable<string>): FeedModel | null
export function useFeedById<T>(feedId: Nullable<string>, selector: (feed: FeedModel) => T): T | null
export function useFeedById<T>(feedId: Nullable<string>, transform?: (feed: FeedModel) => T) {
  return useFeedStore(
    useCallback(
      (state) =>
        transform
          ? feedByIdWithTransformSelector(feedId, transform)(state)
          : feedByIdSelector(feedId)(state),
      [feedId, transform],
    ),
  )
}

export const useFeedByIdOrUrl = (feed: FeedQueryParams) =>
  useFeedStore(useCallback((state) => feedByIdOrUrlSelector(feed)(state), [feed]))

export const useFeedByIdSelector = <T>(
  feedId: Nullable<string>,
  selector: (feed: FeedOrListRespModel) => T,
) =>
  useFeedStore(
    useCallback(
      (state) => feedByIdSelectorWithTransform(feedId, selector)(state),
      [feedId, selector],
    ),
  )

export const useListByIdSelector = <T>(
  listId: Nullable<string>,
  selector: (list: ListModel) => T,
) =>
  useListStore(
    useCallback(
      (state) => listByIdSelectorWithTransform(listId, selector)(state),
      [listId, selector],
    ),
  )

export const useInboxByIdSelector = <T>(
  inboxId: Nullable<string>,
  selector: (inbox: InboxModel) => T,
) =>
  useInboxStore(
    useCallback(
      (state) => inboxByIdSelectorWithTransform(inboxId, selector)(state),
      [inboxId, selector],
    ),
  )

export const useFeedHeaderTitle = () => {
  const { t } = useTranslation()

  const { feedId: currentFeedId, view, listId, inboxId } = useRouteParams()

  const listTitle = useListByIdSelector(listId, getPreferredTitle)
  const inboxTitle = useInboxByIdSelector(inboxId, getPreferredTitle)
  const feedTitle = useFeedByIdSelector(currentFeedId, getPreferredTitle)

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

export const useResetFeed = () => {
  const { t } = useTranslation()
  const toastIDRef = useRef<string | number | null>(null)

  return useMutation({
    mutationFn: async (feedId: string) => {
      toastIDRef.current = toast.loading(t("sidebar.feed_actions.resetting_feed"))
      await apiClient.feeds.reset.$get({ query: { id: feedId } })
    },
    onSuccess: (_, feedId) => {
      entries.entries({ feedId }).invalidateRoot()
      toast.success(
        t("sidebar.feed_actions.reset_feed_success"),
        toastIDRef.current ? { id: toastIDRef.current } : undefined,
      )
    },
    onError: () => {
      toast.error(
        t("sidebar.feed_actions.reset_feed_error"),
        toastIDRef.current ? { id: toastIDRef.current } : undefined,
      )
    },
  })
}
