import {
  UnAuthorizedError,
  UnprocessableEntityError,
} from "@renderer/biz/error"
import { useBizInfiniteQuery } from "@renderer/hooks/useBizQuery"
import { levels } from "@renderer/lib/constants"
import { defineQuery } from "@renderer/lib/defineQuery"
import type { EntriesResponse, ListResponse } from "@renderer/lib/types"
import { apiClient, apiFetch } from "@renderer/queries/api-fetch"

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
      ["entries", level, id],
      async ({ pageParam }) => {
        const params: {
          category?: string
          view?: number
          feedId?: string
          feedIdList?: string[]
        } = {}
        if (level === levels.folder) {
          params.feedIdList = `${id}`.split(",")
        } else if (level === levels.feed) {
          params.feedId = `${id}`
        }
        return await apiFetch<ListResponse<EntriesResponse>>("/entries", {
          method: "POST",
          body: {
            offset: pageParam,
            view,
            ...params,
          },
        })
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
        const res = await apiClient.entries.$get({ query: { id } })
        const json = await res.json()
        if (json.code === 1) {
          throw new UnAuthorizedError()
        }
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
