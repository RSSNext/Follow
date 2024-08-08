import { useAuthQuery } from "@renderer/hooks/common"
import { apiClient, getFetchErrorMessage } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import { formatXml } from "@renderer/lib/utils"
import type { FeedQueryParams } from "@renderer/store/feed"
import { feedActions } from "@renderer/store/feed"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

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
        const $document = new DOMParser().parseFromString(
          res.data.xml,
          "text/xml",
        )
        res.data.xml = formatXml(
          new XMLSerializer().serializeToString($document),
        )
        return res
      })),
}

export const useFeed = ({ id, url }: FeedQueryParams) =>
  useAuthQuery(
    feed.byId({
      id,
      url,
    }),
    {
      enabled: !!id || !!url,
    },
  )

export const useClaimFeedMutation = (feedId: string) =>
  useMutation({
    mutationKey: ["claimFeed", feedId],
    mutationFn: () => feedActions.claimFeed(feedId),

    async onError(err) {
      toast.error(getFetchErrorMessage(err))
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
          id: feedId!,
        })
        .invalidateRoot()
    },
    async onError(err) {
      toast.error(getFetchErrorMessage(err))
    },
  })
