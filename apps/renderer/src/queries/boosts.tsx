import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"
import { toastFetchError } from "~/lib/error-parser"

export const boosts = {
  getStatus: ({ feedId }: { feedId: string }) =>
    defineQuery(["boostFeed", feedId], async () => {
      const res = await apiClient.boosts.$get({
        query: {
          feedId,
        },
      })
      return res.data
    }),
  getBoosters: ({ feedId }: { feedId: string }) =>
    defineQuery(["boosters", feedId], async () => {
      const res = await apiClient.boosts.boosters.$get({
        query: {
          feedId,
        },
      })
      return res.data
    }),
}

export const useBoostFeedMutation = () =>
  useMutation({
    mutationFn: (data: Parameters<typeof apiClient.boosts.$post>[0]["json"]) =>
      apiClient.boosts.$post({ json: data }),
    onError(err) {
      toastFetchError(err)
    },
    onSuccess(_, variables) {
      boosts.getStatus({ feedId: variables.feedId }).invalidate()
      boosts.getBoosters({ feedId: variables.feedId }).invalidate()
      window.analytics?.capture("boost_sent", {
        amount: variables.amount,
        feedId: variables.feedId,
      })
      toast("🎉 Boosted.")
    },
  })
