import { useAuthInfiniteQuery, useAuthQuery } from "@renderer/hooks/common"
import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import { entryActions } from "@renderer/store/entry"

export const entries = {
  entries: ({
    id,
    view,
    read,
  }: {
    id?: number | string
    view?: number
    read?: boolean
  }) =>
    defineQuery(
      ["entries", id, view, read],
      async ({ pageParam }) =>
        entryActions.fetchEntries({
          id,
          view,
          read,

          pageParam: pageParam as string,
        }),
      {
        rootKey: ["entries", id],
      },
    ),
  byId: (id: string) =>
    defineQuery(["entry", id], async () => entryActions.fetchEntryById(id), {
      rootKey: ["entries"],
    }),
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
  id,
  view,
  read,
}: {
  id?: number | string
  view?: number
  read?: boolean
}) =>
  useAuthInfiniteQuery(entries.entries({ id, view, read }), {
    enabled: id !== undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data?.length) {
        return null
      }
      return lastPage.data.at(-1)!.entries.publishedAt
    },
    initialPageParam: undefined,
    refetchInterval: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

export const useEntriesPreview = ({ id }: { id?: string }) =>
  useAuthQuery(entries.preview(id!), {
    enabled: !!id,
  })
