import { UnprocessableEntityError } from "@renderer/biz/error"
import { useBizInfiniteQuery } from "@renderer/hooks/useBizQuery"
import { defineQuery } from "@renderer/lib/defineQuery"
import { apiClient } from "@renderer/queries/api-fetch"
import { entryActions } from "@renderer/store/entry"

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
      async ({ pageParam }) =>

        entryActions.fetchEntries({
          level,
          id,
          view,
          read,
          pageParam: pageParam as string,
        }),
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
    getNextPageParam: (lastPage) => {
      if (!lastPage.data?.length) {
        return null
      }
      return lastPage.data.at(-1)!.entries.publishedAt
    },
    initialPageParam: undefined,
  })
