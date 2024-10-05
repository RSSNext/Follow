import { useMutation } from "@tanstack/react-query"

import { ROUTE_FEED_IN_FOLDER, ROUTE_FEED_PENDING } from "~/constants"
import { useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"
import { toastFetchError } from "~/lib/error-parser"
import { formatXml } from "~/lib/utils"
import type { FeedQueryParams } from "~/store/feed"
import { feedActions } from "~/store/feed"

import { entries } from "./entries"

export const feed = {
  byId: ({ id, url }: FeedQueryParams) =>
    defineQuery(
      ["feed", id, url],
      async () =>
        feedActions.fetchFeedById({
          id,
          url,
        }),
      {
        rootKey: ["feed"],
      },
    ),
  claimMessage: ({ feedId }: { feedId: string }) =>
    defineQuery(["feed", "claimMessage", feedId], async () =>
      apiClient.feeds.claim.message.$get({ query: { feedId } }).then((res) => {
        res.data.json = JSON.stringify(JSON.parse(res.data.json), null, 2)
        const $document = new DOMParser().parseFromString(res.data.xml, "text/xml")
        res.data.xml = formatXml(new XMLSerializer().serializeToString($document))
        return res
      }),
    ),
  claimedList: () =>
    defineQuery(["feed", "claimedList"], async () => {
      const res = await apiClient.feeds.claim.list.$get()
      return res.data
    }),
}

export const useFeed = ({ id, url }: FeedQueryParams) =>
  useAuthQuery(
    feed.byId({
      id,
      url,
    }),
    {
      enabled:
        (!!id || !!url) && id !== ROUTE_FEED_PENDING && !id?.startsWith(ROUTE_FEED_IN_FOLDER),
    },
  )

export const useClaimFeedMutation = (feedId: string) =>
  useMutation({
    mutationKey: ["claimFeed", feedId],
    mutationFn: () => feedActions.claimFeed(feedId),

    async onError(err) {
      toastFetchError(err)
    },
    onSuccess() {
      window.posthog?.capture("feed_claimed", {
        feedId,
      })
    },
  })

export const useRefreshFeedMutation = (feedId?: string) =>
  useMutation({
    mutationKey: ["refreshFeed", feedId],
    mutationFn: () => apiClient.feeds.refresh.$get({ query: { id: feedId! } }),

    onSuccess() {
      if (!feedId) return
      entries
        .entries({
          feedId: feedId!,
        })
        .invalidateRoot()
    },
    async onError(err) {
      toastFetchError(err)
    },
  })
