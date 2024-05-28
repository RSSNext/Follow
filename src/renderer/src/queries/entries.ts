import {
  UnprocessableEntityError,
} from "@renderer/biz/error"
import { useBizInfiniteQuery } from "@renderer/hooks/useBizQuery"
import { levels } from "@renderer/lib/constants"
import { defineQuery } from "@renderer/lib/defineQuery"
import { apiClient } from "@renderer/queries/api-fetch"

export const entries = {
  entries: ({
    level,
    id,
    view,
  }: {
    level?: string
    id?: number | string
    view?: number
  }) =>
    defineQuery(
      ["entries", level, id, view],
      async ({ pageParam }) => {
        const params: {
          feedId?: string
          feedIdList?: string[]
        } = {}
        if (level === levels.folder) {
          params.feedIdList = `${id}`.split(",")
        } else if (level === levels.feed) {
          params.feedId = `${id}`
        }
        const res = await apiClient.entries.$post({
          json: {
            offset: pageParam as number | undefined,
            view,
            ...params,
          },
        })
        return await res.json()
      },
      {
        rootKey: ["entries"],
      },
    ),
  byId: (id?: string | null) =>
    defineQuery(
      ["entry", id],
      async () => {
        if (!id) {
          throw new UnprocessableEntityError("id is required")
        }
        const res = await apiClient.entries.$get({
          query: {
            id,
          },
        })
        const json = await res.json()

        return json.data
      },
      {
        rootKey: ["entries"],
      },
    ),
}

export const useEntries = ({
  level,
  id,
  view,
}: {
  level?: string
  id?: number | string
  view?: number
}) =>
  useBizInfiniteQuery(entries.entries({ level, id, view }), {
    enabled: level !== undefined && id !== undefined,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      (lastPageParam as number) + (lastPage.data?.length || 0),
    initialPageParam: 0,
  })
