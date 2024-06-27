import { getUser } from "@renderer/atoms/user"
import { useBizQuery } from "@renderer/hooks"
import { apiClient, getFetchErrorMessage } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import { feedActions } from "@renderer/store"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { Queries } from "."

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
      apiClient.feeds.claim.message.$get({ query: { feedId } })),
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

export const useClaimFeedMutation = (feedId: string) => useMutation({
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

export const useRefreshFeedMutation = (feedId?: string) => useMutation({
  mutationKey: ["refreshFeed", feedId],
  mutationFn: () => apiClient.feeds.refresh.$get({ query: { id: feedId! } }),

  onSuccess() {
    if (!feedId) return
    Queries.entries.entries({
      id: feedId!,
    }).invalidateRoot()
  },
  async onError(err) {
    toast.error(await getFetchErrorMessage(err))
  },
})
