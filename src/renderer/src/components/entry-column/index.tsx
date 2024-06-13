import { ActionButton, Button } from "@renderer/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@renderer/components/ui/popover"
import { apiClient } from "@renderer/lib/api-fetch"
import { views } from "@renderer/lib/constants"
import { buildStorageNS } from "@renderer/lib/ns"
import { getEntriesParams } from "@renderer/lib/utils"
import { useEntries } from "@renderer/queries/entries"
import {
  feedActions,
  subscriptionActions,
  useFeedStore,
} from "@renderer/store"
import { entryActions, useEntryIdsByFeedIdOrView } from "@renderer/store/entry"
import { m } from "framer-motion"
import { useAtom, useAtomValue } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { debounce } from "lodash-es"
import type { FC } from "react"
import { forwardRef, useCallback, useMemo, useRef, useState } from "react"
import type { ListRange } from "react-virtuoso"
import { Virtuoso, VirtuosoGrid } from "react-virtuoso"
import { useEventCallback } from "usehooks-ts"
import { useShallow } from "zustand/react/shallow"

import { EmptyIcon } from "../icons/empty"
import { EntryItemWrapper } from "./item-wrapper"

const unreadOnlyAtom = atomWithStorage<boolean>(
  buildStorageNS("entry-unreadonly"),
  true,
  undefined,
  {
    getOnInit: true,
  },
)

const { setActiveEntry } = feedActions

export function EntryColumn() {
  const activeList = useFeedStore((state) => state.activeList)
  const entries = useEntriesByView()
  const { entriesIds } = entries

  const handleRangeChange = useEventCallback(
    debounce(
      async ({ startIndex }: ListRange) => {
        const idSlice = entriesIds?.slice(0, startIndex)

        if (!idSlice) return

        const batchLikeIds = [] as [string, string][]
        const entriesId2Map = entryActions.getFlattenMapEntries()
        for (const id of idSlice) {
          const entry = entriesId2Map[id]

          if (!entry) continue
          const isRead = entry.read
          if (!isRead) {
            batchLikeIds.push([entry.feeds.id, id])
          }
        }

        if (batchLikeIds.length > 0) {
          const entryIds = batchLikeIds.map(([, id]) => id)
          await apiClient.reads.$post({ json: { entryIds } })

          for (const [feedId, id] of batchLikeIds) {
            entryActions.markRead(feedId, id, true)
          }
        }
      },
      1000,
      { leading: false },
    ),
  )

  const virtuosoOptions = {
    components: {
      List: ListContent,
      EmptyPlaceholder: EmptyList,
    },
    overscan: window.innerHeight,
    rangeChanged: handleRangeChange,
    totalCount: entries.totalCount,
    endReached: () => entries.hasNextPage && entries.fetchNextPage(),
    data: entriesIds,
    itemContent: useCallback(
      (_, entryId: string) => {
        if (!entryId) return null

        return (
          <EntryItemWrapper
            key={entryId}
            entryId={entryId}
            view={activeList?.view}
          />
        )
      },
      [activeList?.view],
    ),
  }

  return (
    <div
      className="relative flex h-full flex-1 flex-col"
      onClick={() => setActiveEntry(null)}
      data-total-count={virtuosoOptions.totalCount}
    >
      <ListHeader />
      {virtuosoOptions.totalCount === 0 ? (
        <EmptyList />
      ) : activeList?.view && views[activeList.view].gridMode ?
          (
            <VirtuosoGrid
              listClassName="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 px-4"
              {...virtuosoOptions}
            />
          ) :
          (
            <Virtuoso {...virtuosoOptions} />
          )}
    </div>
  )
}

const useEntriesByView = () => {
  const activeList = useFeedStore(useShallow((state) => state.activeList))
  const unreadOnly = useAtomValue(unreadOnlyAtom)

  const query = useEntries({
    level: activeList?.level,
    id: activeList.id,
    view: activeList?.view,
    ...(unreadOnly === true && { read: false }),
  })
  const entries = useEntryIdsByFeedIdOrView(activeList.id, {
    unread: unreadOnly,
  })

  // in unread only entries only can grow the data, but not shrink
  // so we memo this previous data to avoid the flicker
  const prevEntries = useRef(entries)
  const nextEntries = useMemo(() => {
    if (!unreadOnly) {
      prevEntries.current = []
      return entries
    }
    if (!prevEntries.current) {
      prevEntries.current = entries
      return entries
    }
    if (entries.length > prevEntries.current.length) {
      prevEntries.current = entries
      return entries
    }
    // merge the new entries with the old entries, and unique them
    const nextIds = [...new Set([...prevEntries.current, ...entries])]
    prevEntries.current = nextIds
    return nextIds
  }, [entries, prevEntries, unreadOnly])

  const remoteEntryIds = useMemo(
    () =>
      query.data ?
        query.data.pages.reduce((acc, page) => {
          if (!page.data) return acc
          acc.push(...page.data.map((entry) => entry.entries.id))
          return acc
        }, [] as string[]) :
        null,
    [query.data],
  )
  return {
    ...query,

    // If remote data is not available, we use the local data, get the local data length
    totalCount: query.data?.pages?.[0]?.total ?? nextEntries.length,
    entriesIds:
      // FIXME we can't filter collections in local mode, so we need to use the remote data
      // activeList.id === FEED_COLLECTION_LIST ? remoteEntryIds : nextEntries,
      // NOTE: if we use the remote data, priority will be given to the remote data, local data maybe had sort issue
      remoteEntryIds ?? nextEntries,
  }
}

const ListHeader: FC = () => {
  const activeList = useFeedStore(useShallow((state) => state.activeList))
  const [unreadOnly, setUnreadOnly] = useAtom(unreadOnlyAtom)
  const entries = useEntriesByView()

  const [markPopoverOpen, setMarkPopoverOpen] = useState(false)
  const handleMarkAllAsRead = useCallback(async () => {
    if (!activeList) return
    await apiClient.reads.all.$post({
      json: {
        ...getEntriesParams({
          level: activeList?.level,
          id: activeList?.id,
          view: activeList?.view,
        }),
      },
    })

    if (typeof activeList.id === "number") {
      subscriptionActions.markReadByView(activeList.view)
    } else {
      activeList.id.split(",").forEach((feedId) => {
        entryActions.markReadByFeedId(feedId)
      })
    }
    setMarkPopoverOpen(false)
  }, [activeList])

  return (
    <div className="mb-5 flex w-full flex-col pl-11 pr-4 pt-2.5">
      <div className="flex w-full justify-end">
        <div className="relative z-[1] flex items-center gap-1 text-zinc-500">
          <ActionButton
            tooltip={unreadOnly ? "Unread Only" : "All"}
            onClick={() => setUnreadOnly(!unreadOnly)}
          >
            {unreadOnly ? (
              <i className="i-mingcute-round-fill" />
            ) : (
              <i className="i-mingcute-round-line" />
            )}
          </ActionButton>
          <Popover open={markPopoverOpen} onOpenChange={setMarkPopoverOpen}>
            <PopoverTrigger>
              <ActionButton onClick={() => {}} tooltip="Mark All as Read">
                <i className="i-mingcute-check-circle-line" />
              </ActionButton>
            </PopoverTrigger>
            <PopoverContent className="flex w-fit flex-col items-center justify-center gap-3 text-[15px] font-medium">
              <div>Mark all as read?</div>
              <div className="space-x-4">
                <PopoverClose>
                  <Button size="sm" variant="outline">
                    Cancel
                  </Button>
                </PopoverClose>
                {/* TODO */}
                <Button size="sm" onClick={handleMarkAllAsRead}>
                  Confirm
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        <div className="text-lg font-bold leading-none">{activeList?.name}</div>
        <div className="text-xs font-medium text-zinc-400">
          {entries.data?.pages?.[0].total || 0}
          {" "}
          {unreadOnly ? "Unread" : ""}
          {" "}
          Items
        </div>
      </div>
    </div>
  )
}

const ListContent = forwardRef<HTMLDivElement>((props, ref) => (
  <m.div
    initial={{ opacity: 0.01, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0.01, y: -100 }}
    className="px-2"
    {...props}
    ref={ref}
  />
))

const EmptyList = (props, ref) => {
  const unreadOnly = useAtomValue(unreadOnlyAtom)

  return (
    <m.div
      initial={{ opacity: 0.01, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0.01, y: -100 }}
      className="-mt-20 flex h-full flex-col items-center justify-center gap-2 text-zinc-400"
      {...props}
      ref={ref}
    >
      {unreadOnly ? (
        <>
          <i className="i-mingcute-celebrate-line -mt-11 text-3xl" />
          Zero Unread
        </>
      ) : (
        <div className="flex -translate-y-6 flex-col items-center justify-center gap-2">
          <EmptyIcon className="size-[30px]" />
          Zero Items
        </div>
      )}
    </m.div>
  )
}
