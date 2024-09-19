import { useAuthInfiniteQuery, useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"
import { getEntriesParams } from "~/lib/utils"
import { entryActions } from "~/store/entry"
import { entryHistoryActions } from "~/store/entry-history/action"

export const entries = {
  entries: ({
    id,
    view,
    read,
    limit,
    isArchived,
  }: {
    id?: number | string
    view?: number
    read?: boolean
    limit?: number
    isArchived?: boolean
  }) =>
    defineQuery(
      ["entries", id, view, read, limit],
      async ({ pageParam }) =>
        entryActions.fetchEntries({
          id,
          view,
          read,
          limit,
          pageParam: pageParam as string,
          isArchived,
        }),
      {
        rootKey: ["entries", id],
        structuralSharing: false,
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

  checkNew: ({
    id,
    view,
    read,
    fetchedTime,
  }: {
    id?: number | string
    view?: number
    read?: boolean
    fetchedTime: number
  }) =>
    defineQuery(
      ["entry-checkNew", id, view, read, fetchedTime],
      async () => {
        const query = {
          ...getEntriesParams({
            id,
            view,
          }),
          read,
          insertedAfter: fetchedTime,
        }

        if (query.feedIdList && query.feedIdList.length === 1) {
          query.feedId = query.feedIdList[0]
          delete query.feedIdList
        }
        return apiClient.entries["check-new"].$get({
          query: {
            insertedAfter: `${query.insertedAfter}`,
            view: `${query.view}`,
            feedId: query.feedId,
            read: typeof query.read === "boolean" ? JSON.stringify(query.read) : undefined,
            feedIdList: query.feedIdList,
          },
        }) as Promise<{ data: { has_new: boolean; lastest_at?: string } }>
      },

      {
        rootKey: ["entry-checkNew", id],
      },
    ),

  entryReadingHistory: (entryId: string) =>
    defineQuery(
      ["entry-reading-history", entryId],
      async () => entryHistoryActions.fetchEntryHistory(entryId),
      {
        rootKey: ["entry-reading-history", entryId],
      },
    ),
}

export const useEntries = ({
  id,
  view,
  read,
  isArchived,
}: {
  id?: number | string
  view?: number
  read?: boolean
  isArchived?: boolean
}) =>
  useAuthInfiniteQuery(entries.entries({ id, view, read, isArchived }), {
    enabled: id !== undefined,
    getNextPageParam: (lastPage) => lastPage.data?.at(-1)?.entries.publishedAt,
    initialPageParam: undefined,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

export const useEntriesPreview = ({ id }: { id?: string }) =>
  useAuthQuery(entries.preview(id!), {
    enabled: !!id,
  })
