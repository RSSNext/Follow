import { views } from "@follow/constants"
import { useMutation } from "@tanstack/react-query"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useGeneralSettingKey } from "~/atoms/settings/general"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { useAuthQuery } from "~/hooks/common"
import { apiClient, apiFetch } from "~/lib/api-fetch"
import { entries, useEntries } from "~/queries/entries"
import { entryActions, getEntry, useEntryIdsByFeedIdOrView } from "~/store/entry"
import { useFolderFeedsByFeedId } from "~/store/subscription"
import { feedUnreadActions } from "~/store/unread"

const anyString = [] as string[]
export const useEntriesByView = ({
  onReset,
  isArchived,
}: {
  onReset?: () => void
  isArchived?: boolean
}) => {
  const { feedId, isAllFeeds, view, isCollection, inboxId, listId } = useRouteParams()

  const unreadOnly = useGeneralSettingKey("unreadOnly")

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

      onReset?.()
    }
  }, [isFetchingFirstPage, isArchived])

  const entryIdsAsDeps = entryIds.toString()

  useEffect(() => {
    prevEntryIdsRef.current = []
  }, [feedId])
  useEffect(() => {
    if (!prevEntryIdsRef.current) {
      prevEntryIdsRef.current = entryIds

      return
    }
    // merge the new entries with the old entries, and unique them
    const nextIds = [...new Set([...prevEntryIdsRef.current, ...entryIds])]
    prevEntryIdsRef.current = nextIds
  }, [entryIdsAsDeps])

  const sortEntries = useMemo(
    () =>
      isCollection
        ? sortEntriesIdByStarAt(entryIds)
        : listId
          ? sortEntriesIdByEntryInsertedAt(entryIds)
          : sortEntriesIdByEntryPublishedAt(entryIds),
    [entryIds, isCollection, listId],
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
      const promise = query.refetch()
      feedUnreadActions.fetchUnreadByView(view)
      return promise
    }, [query, view]),
    entriesIds: sortEntries,
    groupedCounts,
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
