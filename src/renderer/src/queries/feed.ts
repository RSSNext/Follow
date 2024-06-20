import { useBizQuery } from "@renderer/hooks"
import { apiClient, getFetchErrorMessage } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

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
    defineQuery(["feed", "claimMessage"], async () =>
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
  mutationFn: () => apiClient.feeds.claim.challenge.$post({
    json: {
      feedId,
    },
  }),
  async onError(err) {
    toast.error(await getFetchErrorMessage(err))
  },
})
