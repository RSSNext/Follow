import { useFeedUnreadIsDirty } from "~/atoms/feed"
import { useGeneralSettingKey } from "~/atoms/settings/general"
import { useAuthInfiniteQuery, useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"
import { getEntriesParams } from "~/lib/utils"
import { entryActions } from "~/store/entry"
import { entryHistoryActions } from "~/store/entry-history/action"

export const entries = {
  entries: ({
    feedId,
    inboxId,
    listId,
    view,
    read,
    limit,
    isArchived,
  }: {
    feedId?: number | string
    inboxId?: number | string
    listId?: number | string
    view?: number
    read?: boolean
    limit?: number
    isArchived?: boolean
  }) =>
    defineQuery(
      ["entries", inboxId || listId || feedId, view, read, limit, isArchived],
      async ({ pageParam }) =>
        entryActions.fetchEntries({
          feedId,
          inboxId,
          listId,
          view,
          read,
          limit,
          pageParam: pageParam as string,
          isArchived,
        }),
      {
        rootKey: ["entries", inboxId || listId || feedId],
      },
    ),
  byId: (id: string) =>
    defineQuery(["entry", id], async () => entryActions.fetchEntryById(id), {
      rootKey: ["entries"],
    }),
  byInboxId: (id: string) =>
    defineQuery(["entry", "inbox", id], async () => entryActions.fetchInboxEntryById(id), {
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
    feedId,
    inboxId,
    listId,
    view,
    read,
    fetchedTime,
  }: {
    feedId?: number | string
    inboxId?: number | string
    listId?: number | string
    view?: number
    read?: boolean
    fetchedTime: number
  }) =>
    defineQuery(
      ["entry-checkNew", inboxId || listId || feedId, view, read, fetchedTime],
      async () => {
        const query = {
          ...getEntriesParams({
            feedId,
            inboxId,
            listId,
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
            insertedAfter: query.insertedAfter,
            view: query.view,
            feedId: query.feedId,
            read: typeof query.read === "boolean" ? JSON.stringify(query.read) : undefined,
            feedIdList: query.feedIdList,
          },
        }) as Promise<{ data: { has_new: boolean; lastest_at?: string } }>
      },

      {
        rootKey: ["entry-checkNew", inboxId || listId || feedId],
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

const maxStaleTime = 6 * 60 * (60 * 1000) // 6 hours
const defaultStaleTime = 10 * (60 * 1000) // 10 minutes

export const useEntries = ({
  feedId,
  inboxId,
  listId,
  view,
  read,
  isArchived,
}: {
  feedId?: number | string
  inboxId?: number | string
  listId?: number | string
  view?: number
  read?: boolean
  isArchived?: boolean
}) => {
  const reduceRefetch = useGeneralSettingKey("reduceRefetch")
  const fetchUnread = read === false
  const feedUnreadDirty = useFeedUnreadIsDirty((feedId as string) || "")

  return useAuthInfiniteQuery(
    entries.entries({ feedId, inboxId, listId, view, read, isArchived }),
    {
      enabled: feedId !== undefined || inboxId !== undefined || listId !== undefined,
      getNextPageParam: (lastPage) =>
        inboxId || listId
          ? lastPage.data?.at(-1)?.entries.insertedAt
          : lastPage.data?.at(-1)?.entries.publishedAt,
      initialPageParam: undefined,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: fetchUnread && feedUnreadDirty ? "always" : false,

      staleTime:
        // Force refetch unread entries when feed is dirty
        fetchUnread && feedUnreadDirty
          ? 0
          : // Keep reduce data fetch logic
            reduceRefetch
            ? maxStaleTime
            : defaultStaleTime,
    },
  )
}

export const useEntriesPreview = ({ id }: { id?: string }) =>
  useAuthQuery(entries.preview(id!), {
    enabled: !!id,
  })
