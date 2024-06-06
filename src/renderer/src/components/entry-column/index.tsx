import { Button, HeaderActionButton } from "@renderer/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@renderer/components/ui/popover"
import { apiClient } from "@renderer/lib/api-fetch"
import { views } from "@renderer/lib/constants"
import { FeedViewType } from "@renderer/lib/enum"
import { buildStorageNS } from "@renderer/lib/ns"
import { getEntriesParams } from "@renderer/lib/utils"
import type { EntryModel } from "@renderer/models"
import { useEntries } from "@renderer/queries/entries"
import {
  feedActions,
  subscriptionActions,
  useFeedStore,
} from "@renderer/store"
import { entryActions } from "@renderer/store/entry"
import { m } from "framer-motion"
import { useAtom, useAtomValue } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { debounce } from "lodash-es"
import type { FC } from "react"
import { forwardRef, useCallback, useState } from "react"
import type { ListRange } from "react-virtuoso"
import { Virtuoso, VirtuosoGrid } from "react-virtuoso"
import { useEventCallback } from "usehooks-ts"
import { useShallow } from "zustand/react/shallow"

import { ArticleItem } from "./article-item"
import { AudioItem } from "./audio-item"
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
    case FeedViewType.Articles: {
      Item = ArticleItem
      break
    }
    case FeedViewType.SocialMedia: {
      Item = SocialMediaItem
      break
    }
    case FeedViewType.Pictures: {
      Item = PictureItem
      break
    }
    case FeedViewType.Videos: {
      Item = VideoItem
      break
    }
    case FeedViewType.Audios: {
      Item = AudioItem
      break
    }
    case FeedViewType.Notifications: {
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
    totalCount: entries.data?.pages?.[0]?.total,
    endReached: () => entries.hasNextPage && entries.fetchNextPage(),
    data: entries.data?.pages.flatMap((page) => page.data) || [],
    itemContent: useCallback(
      (_, entry: EntryModel | undefined) => {
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
      },
      [Item, activeList?.view],
    ),
  }

  return (
    <div
      className="relative flex h-full flex-1 flex-col"
      onClick={() => setActiveEntry?.(null)}
    >
      <ListHeader />
      {activeList?.view && views[activeList.view].gridMode ? (
        <VirtuosoGrid
          listClassName="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 px-4"
          {...virtuosoOptions}
        />
      ) : (
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
          <HeaderActionButton
            tooltip={unreadOnly ? "Unread Only" : "All"}
            onClick={() => setUnreadOnly(!unreadOnly)}
          >
            {unreadOnly ? (
              <i className="i-mingcute-round-fill" />
            ) : (
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
      className="-mt-10 flex h-full flex-col items-center justify-center gap-2 text-zinc-400"
      {...props}
      ref={ref}
    >
      {unreadOnly && (
        <>
          <i className="i-mingcute-celebrate-line text-4xl" />
          Zero Unread
        </>
      )}
    </m.div>
  )
}
