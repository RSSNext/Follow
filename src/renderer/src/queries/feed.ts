import {
  UnprocessableFeedError,
} from "@renderer/biz/error"
import { useBizQuery } from "@renderer/hooks/useBizQuery"
import { defineQuery } from "@renderer/lib/defineQuery"
import { apiClient } from "@renderer/queries/api-fetch"

export const feed = {
  byId: (id?: string | null) =>
    defineQuery(
      ["feed", id],
      async () => {
        if (!id) {
          throw new UnprocessableFeedError("id is required")
        }
        const res = await apiClient.feeds.$get({
          query: {
            id,
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
}: {
  id?: string | null
}) =>
  useBizQuery(feed.byId(id), {
    enabled: !!id,
  })
