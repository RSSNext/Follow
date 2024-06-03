import { Button, HeaderActionButton } from "@renderer/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@renderer/components/ui/popover"
import { views } from "@renderer/lib/constants"
import { buildStorageNS } from "@renderer/lib/ns"
import type {
  EntryModel,
} from "@renderer/lib/types"
import { cn, getEntriesParams } from "@renderer/lib/utils"
import { apiClient } from "@renderer/queries/api-fetch"
import { useEntries } from "@renderer/queries/entries"
import { feedActions, useFeedStore } from "@renderer/store"
import { entryActions } from "@renderer/store/entry"
import { m } from "framer-motion"
import { useAtom, useAtomValue } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { debounce } from "lodash-es"
import type { FC } from "react"
import { forwardRef, useCallback, useState } from "react"
import type {
  ListRange,
  VirtuosoProps,
} from "react-virtuoso"
import { Virtuoso, VirtuosoGrid } from "react-virtuoso"
import { useEventCallback } from "usehooks-ts"
import { useShallow } from "zustand/react/shallow"

import { ArticleItem } from "./article-item"
import { EntryItemWrapper } from "./item-wrapper"
import { NotificationItem } from "./notification-item"
import { PictureItem } from "./picture-item"
import { SocialMediaItem } from "./social-media-item"
import type { UniversalItemProps } from "./types"
import { VideoItem } from "./video-item"

const unreadOnlyAtom = atomWithStorage<boolean>(
  buildStorageNS("entry-unreadonly"),
  true,
)

const { setActiveEntry } = feedActions

export function EntryColumn() {
  const activeList = useFeedStore((state) => state.activeList)
  const entries = useEntriesByTab()

  const entriesIds = (entries.data?.pages?.flatMap((page) =>
    page.data?.map((entry) => entry.entries.id),
  ) || []) as string[]

  let Item: FC<UniversalItemProps>
  switch (activeList?.view) {
    case 0: {
      Item = ArticleItem
      break
    }
    case 1: {
      Item = SocialMediaItem
      break
    }
    case 2: {
      Item = PictureItem
      break
    }
    case 3: {
      Item = VideoItem
      break
    }
    case 5: {
      Item = NotificationItem
      break
    }
    default: {
      Item = ArticleItem
    }
  }

  const handleRangeChange = useEventCallback(
    debounce(
      async ({ startIndex }: ListRange) => {
        const idSlice = entriesIds?.slice(0, startIndex)

        if (!idSlice) return

        const batchLikeIds = [] as string[]
        const entriesId2Map = entryActions.getFlattenMapEntries()
        for (const id of idSlice) {
          const entry = entriesId2Map[id]

          if (!entry) continue
          const isRead = entry.read
          if (!isRead) {
            batchLikeIds.push(id)
          }
        }

        if (batchLikeIds.length > 0) {
          await apiClient.reads.$post({ json: { entryIds: batchLikeIds } })

          for (const id of batchLikeIds) {
            entryActions.optimisticUpdate(id, { read: true })
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
    },
    overscan: window.innerHeight,
    rangeChanged: handleRangeChange,
    totalCount: entries.data?.pages?.[0]?.total,
    endReached: () => entries.hasNextPage && entries.fetchNextPage(),
    data: entries.data?.pages.flatMap((page) => page.data) || [],
    itemContent: useCallback((_, entry) => {
      if (!entry) return null
      return (
        <EntryItemWrapper
          key={entry.entries.id}
          entryId={entry.entries.id}
          view={activeList?.view}
        >
          <Item entryId={entry.entries.id} />
        </EntryItemWrapper>
      )
    }, []),
  } satisfies VirtuosoProps<EntryModel, any>

  return (
    <div
      className="relative flex h-full flex-1 flex-col"
      onClick={() => setActiveEntry?.(null)}
    >
      <ListHeader />
      {activeList?.view && views[activeList.view].gridMode ?
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

const useEntriesByTab = () => {
  const activeList = useFeedStore(useShallow((state) => state.activeList))
  const unreadOnly = useAtomValue(unreadOnlyAtom)

  return useEntries({
    level: activeList?.level,
    id: activeList?.id,
    view: activeList?.view,
    ...(unreadOnly === true && { read: false }),
  })
}

const ListHeader: FC = () => {
  const activeList = useFeedStore(useShallow((state) => state.activeList))
  const [unreadOnly, setUnreadOnly] = useAtom(unreadOnlyAtom)
  const entries = useEntriesByTab()

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
    entryActions.optimisticUpdateAll({ read: true })
    setMarkPopoverOpen(false)
  }, [activeList])

  return (
    <div className="mb-5 flex w-full items-center justify-between pl-9 pr-2">
      <div className="mt-4">
        <div className="text-lg font-bold">{activeList?.name}</div>
        <div className="text-xs font-medium text-zinc-400">
          {entries.data?.pages?.[0].total}
          {" "}
          Items
        </div>
      </div>
      <div className="relative z-[1] flex h-14 items-center gap-1 text-zinc-500">
        <HeaderActionButton onClick={entries.refetch} tooltip="Refresh">
          <i
            className={cn(
              "i-mingcute-refresh-2-line",
              entries.isRefetching && "animate-spin",
            )}
          />
        </HeaderActionButton>

        <HeaderActionButton
          tooltip={unreadOnly ? "Unread Only" : "All"}
          onClick={() => setUnreadOnly(!unreadOnly)}
          active={unreadOnly}
        >
          {unreadOnly ?
              (
                <i className="i-mingcute-round-fill" />
              ) :
              (
                <i className="i-mingcute-round-line" />
              )}
        </HeaderActionButton>
        <Popover open={markPopoverOpen} onOpenChange={setMarkPopoverOpen}>
          <PopoverTrigger>
            <HeaderActionButton onClick={() => {}} tooltip="Mark All as Read">
              <i className="i-mingcute-check-circle-line" />
            </HeaderActionButton>
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
  )
}

const ListContent = forwardRef<HTMLDivElement>((props, ref) => {
  const activeList = useFeedStore(useShallow((state) => state.activeList))

  return (
    <m.div
      key={`${activeList?.level}-${activeList?.id}`}
      initial={{ opacity: 0.01, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0.01, y: -100 }}
      className="px-2"
      {...props}
      ref={ref}
    />
  )
})
