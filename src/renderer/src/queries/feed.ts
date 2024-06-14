import { useBizQuery } from "@renderer/hooks"
import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"

export const feed = {
  byId: ({
    id,
    url,
  }: {
    id?: string
    url?: string
  }) =>
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
}

export const useFeed = ({
  id,
  url,
}: {
  id?: string
  url?: string
}) =>
  useBizQuery(feed.byId({
    id,
    url,
  }), {
    enabled: !!id || !!url,
  })
