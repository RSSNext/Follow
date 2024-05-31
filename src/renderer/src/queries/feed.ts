import {
  UnprocessableFeedError,
} from "@renderer/biz/error"
import { useBizQuery } from "@renderer/hooks/useBizQuery"
import { defineQuery } from "@renderer/lib/defineQuery"
import { apiClient } from "@renderer/queries/api-fetch"

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
        if (!id && !url) {
          throw new UnprocessableFeedError("id or url is required")
        }
        const res = await apiClient.feeds.$get({
          query: {
            id,
            url,
          },
        })
        const json = await res.json()

        return json.data
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
