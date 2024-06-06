import { UnprocessableEntityError } from "@renderer/biz/error"
import { useBizInfiniteQuery, useBizQuery } from "@renderer/hooks/useBizQuery"
import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
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

        return res.data
      },
      {
        rootKey: ["entries"],
      },
    ),
  preview: (id: string) =>
    defineQuery(
      ["entries-preview", id],
      async () => {
        const res = await apiClient.entries.preview.$get({
          query: {
            id,
          },
        })

        return res.data
      },
      {
        rootKey: ["entries-preview"],
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

export const useEntriesPreview = ({
  id,
}: {
  id?: string
}) =>
  useBizQuery(entries.preview(id!), {
    enabled: !!id,
  })
