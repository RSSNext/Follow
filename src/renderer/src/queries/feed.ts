import { getUser } from "@renderer/atoms/user"
import { useBizQuery } from "@renderer/hooks"
import { apiClient, getFetchErrorMessage } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import { formatXml } from "@renderer/lib/utils"
import { feedActions } from "@renderer/store"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { entries } from "./entries"

export const feed = {
  byId: ({ id, url }: { id?: string, url?: string }) =>
    defineQuery(
      ["feed", id, url],
      async () => {
        const res = await apiClient.feeds.$get({
          query: {
            id,
            url,
          },
        })

        return res.data
      },
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

export const useFeed = ({ id, url }: { id?: string, url?: string }) =>
  useBizQuery(
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
    mutationFn: () =>
      apiClient.feeds.claim.challenge.$post({
        json: {
          feedId,
        },
      }),

    async onError(err) {
      toast.error(await getFetchErrorMessage(err))
    },
    onSuccess() {
      feedActions.patch(feedId, {
        ownerUserId: getUser()?.id,
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
      toast.error(await getFetchErrorMessage(err))
    },
  })
