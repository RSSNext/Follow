import { views } from "@follow/constants"
import { useMutation } from "@tanstack/react-query"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ListRange } from "react-virtuoso"
import { useDebounceCallback } from "usehooks-ts"

import { useGeneralSettingKey } from "~/atoms/settings/general"
import { useRouteParams, useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useAuthQuery } from "~/hooks/common"
import { apiClient, apiFetch } from "~/lib/api-fetch"
import { entries, useEntries } from "~/queries/entries"
import { entryActions, getEntry, useEntryIdsByFeedIdOrView } from "~/store/entry"
import { useFolderFeedsByFeedId } from "~/store/subscription"
import { feedUnreadActions } from "~/store/unread"

export const useEntryMarkReadHandler = (entriesIds: string[]) => {
  const renderAsRead = useGeneralSettingKey("renderMarkUnread")
  const scrollMarkUnread = useGeneralSettingKey("scrollMarkUnread")
  const feedView = useRouteParamsSelector((params) => params.view)

  const handleMarkReadInRange = useDebounceCallback(
    async ({ startIndex }: ListRange) => {
      const idSlice = entriesIds?.slice(0, startIndex)

      if (!idSlice) return
      batchMarkRead(idSlice)
    },
    500,
    { leading: false },
  )

  const handleRenderAsRead = useCallback(
    async ({ startIndex, endIndex }: ListRange, enabled?: boolean) => {
      if (!enabled) return
      const idSlice = entriesIds?.slice(startIndex, endIndex)

      if (!idSlice) return
      batchMarkRead(idSlice)
    },
    [entriesIds],
  )

  return useMemo(() => {
    if (views[feedView].wideMode && renderAsRead) {
      return handleRenderAsRead
    }

    if (scrollMarkUnread) {
      return handleMarkReadInRange
    }
    return
  }, [feedView, handleMarkReadInRange, handleRenderAsRead, renderAsRead, scrollMarkUnread])
}
const anyString = [] as string[]

export const useEntriesByView = ({
  onReset,
  isArchived,
}: {
  onReset?: () => void
  isArchived?: boolean
}) => {
  const routeParams = useRouteParams()
  const unreadOnly = useGeneralSettingKey("unreadOnly")

  const { feedId, view, isAllFeeds, isCollection, listId, inboxId } = routeParams

  const folderIds = useFolderFeedsByFeedId({
    feedId,
    view,
  })

  const entriesOptions = {
    feedId: folderIds?.join(",") || feedId,
    inboxId,
    listId,
    view,
    ...(unreadOnly === true && { read: false }),
    isArchived,
  }
  const query = useEntries(entriesOptions)

  const [fetchedTime, setFetchedTime] = useState<number>()
  useEffect(() => {
    if (!query.isFetching) {
      setFetchedTime(Date.now())
    }
  }, [query.isFetching])

  const [pauseQuery, setPauseQuery] = useState(false)
  const hasNewQuery = useAuthQuery(
    entries.checkNew({
      ...entriesOptions,
      fetchedTime: fetchedTime!,
    }),
    {
      refetchInterval: 1000 * 60,
      enabled: !!fetchedTime && !pauseQuery,
    },
  )
  const hasUpdate = useMemo(
    () => !!(fetchedTime && hasNewQuery?.data?.data?.has_new),
    [hasNewQuery?.data?.data?.has_new, fetchedTime],
  )

  useEffect(() => {
    setPauseQuery(hasUpdate)
  }, [hasUpdate])

  const remoteEntryIds = useMemo(() => {
    if (!query.data?.pages) return void 0
    // FIXME The back end should not return duplicate data, and the front end the unique id here.
    return [
      ...new Set(
        query.data?.pages?.map((page) => page.data?.map((entry) => entry.entries.id)).flat(),
      ).values(),
    ] as string[]
  }, [query.data?.pages])

  useFetchEntryContentByStream(remoteEntryIds)

  const currentEntries = useEntryIdsByFeedIdOrView(isAllFeeds ? view : folderIds || feedId!, {
    unread: unreadOnly,
    view,
  })

  // If remote data is not available, we use the local data, get the local data length
  // FIXME: remote first, then local store data
  // NOTE: We still can't use the store's data handling directly.
  // Imagine that the local data may be persistent, and then if there are incremental updates to the data on the server side,
  // then we have no way to incrementally update the data.
  // We need to add an interface to incrementally update the data based on the version hash.

  const entryIds: string[] = remoteEntryIds || currentEntries || anyString

  // in unread only entries only can grow the data, but not shrink
  // so we memo this previous data to avoid the flicker
  const prevEntryIdsRef = useRef(entryIds)

  const isFetchingFirstPage = query.isFetching && !query.isFetchingNextPage

  useEffect(() => {
    if (isArchived) {
      return
    }
    if (!isFetchingFirstPage) {
      prevEntryIdsRef.current = entryIds
      setMergedEntries({ ...mergedEntries, [view]: entryIds })
      onReset?.()
    }
  }, [isFetchingFirstPage, isArchived])

  const [mergedEntries, setMergedEntries] = useState<Record<number, string[]>>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  })

  const entryIdsAsDeps = entryIds.toString()

  useEffect(() => {
    prevEntryIdsRef.current = []
  }, [feedId])
  useEffect(() => {
    if (!prevEntryIdsRef.current) {
      prevEntryIdsRef.current = entryIds
      setMergedEntries({ ...mergedEntries, [view]: entryIds })
      return
    }
    // merge the new entries with the old entries, and unique them
    const nextIds = [...new Set([...prevEntryIdsRef.current, ...entryIds])]
    prevEntryIdsRef.current = nextIds
    setMergedEntries({ ...mergedEntries, [view]: entryIds })
  }, [entryIdsAsDeps])

  const sortEntries = useMemo(
    () =>
      isCollection
        ? sortEntriesIdByStarAt(mergedEntries[view])
        : listId
          ? sortEntriesIdByEntryInsertedAt(mergedEntries[view])
          : sortEntriesIdByEntryPublishedAt(mergedEntries[view]),
    [isCollection, listId, mergedEntries, view],
  )

  const groupByDate = useGeneralSettingKey("groupByDate")
  const groupedCounts: number[] | undefined = useMemo(() => {
    if (views[view].gridMode) {
      return
    }
    if (!groupByDate) {
      return
    }
    const entriesId2Map = entryActions.getFlattenMapEntries()
    const counts = [] as number[]
    let lastDate = ""
    for (const id of sortEntries) {
      const entry = entriesId2Map[id]
      if (!entry) {
        continue
      }
      const date = new Date(
        listId ? entry.entries.insertedAt : entry.entries.publishedAt,
      ).toDateString()
      if (date !== lastDate) {
        counts.push(1)
        lastDate = date
      } else {
        const last = counts.pop()
        if (last) counts.push(last + 1)
      }
    }

    return counts
  }, [groupByDate, listId, sortEntries, view])

  return {
    ...query,

    hasUpdate,
    refetch: useCallback(() => {
      query.refetch()
      feedUnreadActions.fetchUnreadByView(view)
    }, [query, view]),
    entriesIds: sortEntries,
    groupedCounts,
    totalCount: query.data?.pages?.[0]?.total ?? mergedEntries[view].length,
  }
}

export function batchMarkRead(ids: string[]) {
  const batchLikeIds = [] as [string, string][]
  const entriesId2Map = entryActions.getFlattenMapEntries()
  for (const id of ids) {
    const entry = entriesId2Map[id]

    if (!entry) continue
    const isRead = entry.read
    if (!isRead) {
      batchLikeIds.push([entry.feedId, id])
    }
  }

  if (batchLikeIds.length > 0) {
    for (const [feedId, id] of batchLikeIds) {
      entryActions.markRead({ feedId, entryId: id, read: true })
    }
  }
}

function sortEntriesIdByEntryPublishedAt(entries: string[]) {
  const entriesId2Map = entryActions.getFlattenMapEntries()
  return entries
    .slice()
    .sort((a, b) =>
      entriesId2Map[b]?.entries.publishedAt.localeCompare(entriesId2Map[a]?.entries.publishedAt),
    )
}

function sortEntriesIdByStarAt(entries: string[]) {
  const entriesId2Map = entryActions.getFlattenMapEntries()
  return entries.slice().sort((a, b) => {
    const aStar = entriesId2Map[a]?.collections?.createdAt
    const bStar = entriesId2Map[b]?.collections?.createdAt
    if (!aStar || !bStar) return 0
    return bStar.localeCompare(aStar)
  })
}

function sortEntriesIdByEntryInsertedAt(entries: string[]) {
  const entriesId2Map = entryActions.getFlattenMapEntries()
  return entries
    .slice()
    .sort((a, b) =>
      entriesId2Map[b]?.entries.insertedAt.localeCompare(entriesId2Map[a]?.entries.insertedAt),
    )
}

const useFetchEntryContentByStream = (remoteEntryIds?: string[]) => {
  const { mutate: updateEntryContent } = useMutation({
    mutationKey: ["stream-entry-content", remoteEntryIds],
    mutationFn: async (remoteEntryIds: string[]) => {
      const onlyNoStored = true

      const nextIds = [] as string[]
      if (onlyNoStored) {
        for (const id of remoteEntryIds) {
          const entry = getEntry(id)
          if (entry.entries.content) {
            continue
          }

          nextIds.push(id)
        }
      }

      if (nextIds.length === 0) return

      const readStream = async () => {
        const response = await apiFetch(apiClient.entries.stream.$url().toString(), {
          method: "post",
          body: JSON.stringify({
            ids: nextIds,
          }),
          responseType: "stream",
        })

        const reader = response.getReader()
        if (!reader) return

        const decoder = new TextDecoder()
        let buffer = ""

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")

            // Process all complete lines
            for (let i = 0; i < lines.length - 1; i++) {
              if (lines[i].trim()) {
                const json = JSON.parse(lines[i])
                // Handle each JSON line here
                entryActions.updateEntryContent(json.id, json.content)
              }
            }

            // Keep the last incomplete line in the buffer
            buffer = lines.at(-1) || ""
          }

          // Process any remaining data
          if (buffer.trim()) {
            const json = JSON.parse(buffer)

            entryActions.updateEntryContent(json.id, json.content)
          }
        } catch (error) {
          console.error("Error reading stream:", error)
        } finally {
          reader.releaseLock()
        }
      }

      readStream()
    },
  })

  useEffect(() => {
    if (!remoteEntryIds) return
    updateEntryContent(remoteEntryIds)
  }, [remoteEntryIds, updateEntryContent])
}
