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
    read,
  }: {
    level?: string
    id?: number | string
    view?: number
    read?: boolean
  }) =>
    defineQuery(
      ["entries", level, id, view, read],
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
            read,
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
  read,
}: {
  level?: string
  id?: number | string
  view?: number
  read?: boolean
}) =>
  useBizInfiniteQuery(entries.entries({ level, id, view, read }), {
    enabled: level !== undefined && id !== undefined,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      (lastPageParam as number) + (lastPage.data?.length || 0),
    initialPageParam: 0,
  })
