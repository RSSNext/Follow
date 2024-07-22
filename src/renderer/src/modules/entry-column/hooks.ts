import { useGeneralSettingKey } from "@renderer/atoms/settings/general"
import { views } from "@renderer/constants"
import {
  useRouteParamsSelector,
  useRouteParms,
} from "@renderer/hooks/biz/useRouteParams"
import { useAuthQuery } from "@renderer/hooks/common"
import { shortcuts } from "@renderer/lib/shortcuts"
import { entries, useEntries } from "@renderer/queries/entries"
import { entryActions, useEntryIdsByFeedIdOrView } from "@renderer/store/entry"
import { useFolderFeedsByFeedId } from "@renderer/store/subscription"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import type { ListRange } from "react-virtuoso"
import { useDebounceCallback } from "usehooks-ts"

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
  }, [
    feedView,
    handleMarkReadInRange,
    handleRenderAsRead,
    renderAsRead,
    scrollMarkUnread,
  ])
}
export const useEntriesByView = ({ onReset }: { onReset?: () => void }) => {
  const routeParams = useRouteParms()
  const unreadOnly = useGeneralSettingKey("unreadOnly")

  const { feedId, view, isAllFeeds, isCollection } = routeParams

  const folderIds = useFolderFeedsByFeedId(feedId)

  const entriesOptions = {
    id: folderIds?.join(",") || feedId,
    view,
    ...(unreadOnly === true && { read: false }),
  }
  const query = useEntries(entriesOptions)

  const lastPublishedAt =
    query.data?.pages?.[0]?.data?.[0]?.entries.publishedAt

  const [pauseQuery, setPauseQuery] = useState(false)
  const hasNewQuery = useAuthQuery(
    entries.checkNew({
      ...entriesOptions,
      lastPublishedAt: lastPublishedAt!,
    }),
    {
      refetchInterval: 1000 * 6,
      enabled: !!lastPublishedAt && !pauseQuery,
    },
  )
  const hasUpdate = useMemo(
    () => lastPublishedAt && hasNewQuery?.data?.data.has_new,
    [hasNewQuery?.data?.data.has_new, lastPublishedAt],
  )

  useEffect(() => {
    if (typeof hasUpdate !== "boolean") return
    setPauseQuery(hasUpdate)
  }, [hasUpdate])

  const remoteEntryIds = useMemo(
    () =>
      query.data?.pages
        ?.map((page) => page.data?.map((entry) => entry.entries.id))
        .flat() as string[],
    [query.data?.pages],
  )

  const currentEntries = useEntryIdsByFeedIdOrView(
    isAllFeeds ? view : feedId!,
    {
      unread: unreadOnly,
      view,
    },
  )

  // If remote data is not available, we use the local data, get the local data length
  // FIXME: remote first, then local store data
  // NOTE: We still can't use the store's data handling directly.
  // Imagine that the local data may be persistent, and then if there are incremental updates to the data on the server side,
  // then we have no way to incrementally update the data.
  // We need to add an interface to incrementally update the data based on the version hash.

  const entryIds = remoteEntryIds || currentEntries

  useHotkeys(
    shortcuts.entries.refetch.key,
    () => {
      query.refetch()
    },
    { scopes: ["home"] },
  )

  // in unread only entries only can grow the data, but not shrink
  // so we memo this previous data to avoid the flicker
  const prevEntryIdsRef = useRef(entryIds)

  const isFetchingFirstPage = query.isFetching && !query.isFetchingNextPage

  useEffect(() => {
    if (!isFetchingFirstPage) {
      prevEntryIdsRef.current = entryIds
      setMergedEntries(entryIds)
      onReset?.()
    }
  }, [isFetchingFirstPage])

  const [mergedEntries, setMergedEntries] = useState<string[]>([])

  const entryIdsAsDeps = entryIds.toString()
  useEffect(() => {
    if (!prevEntryIdsRef.current) {
      prevEntryIdsRef.current = entryIds
      setMergedEntries(entryIds)
      return
    }
    // merge the new entries with the old entries, and unique them
    const nextIds = [...new Set([...prevEntryIdsRef.current, ...entryIds])]
    prevEntryIdsRef.current = nextIds
    setMergedEntries(nextIds)
  }, [entryIdsAsDeps])

  const sortEntries = () =>
    isCollection ?
      sortEntriesIdByStarAt(mergedEntries) :
      sortEntriesIdByEntryPublishedAt(mergedEntries)

  return {
    ...query,

    hasUpdate,
    refetch: useCallback(() => {
      query.refetch()
    }, [query]),
    entriesIds: sortEntries(),
    totalCount: query.data?.pages?.[0]?.total ?? mergedEntries.length,
  }
}

function batchMarkRead(ids: string[]) {
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
      entryActions.markRead(feedId, id, true)
    }
  }
}

function sortEntriesIdByEntryPublishedAt(entries: string[]) {
  const entriesId2Map = entryActions.getFlattenMapEntries()
  return entries
    .slice()
    .sort((a, b) =>
      entriesId2Map[b]?.entries.publishedAt.localeCompare(
        entriesId2Map[a]?.entries.publishedAt,
      ),
    )
}

function sortEntriesIdByStarAt(entries: string[]) {
  const entriesId2Map = entryActions.getFlattenMapEntries()
  return entries.slice().sort((a, b) => {
    const aStar = entriesId2Map[a].collections?.createdAt
    const bStar = entriesId2Map[b].collections?.createdAt
    if (!aStar || !bStar) return 0
    return bStar.localeCompare(aStar)
  })
}
