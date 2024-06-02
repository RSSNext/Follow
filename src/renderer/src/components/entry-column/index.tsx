import { Toggle } from "@renderer/components/ui/toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { views } from "@renderer/lib/constants"
import { buildStorageNS } from "@renderer/lib/ns"
import { apiClient } from "@renderer/queries/api-fetch"
import { useEntries } from "@renderer/queries/entries"
import { feedActions, useFeedStore } from "@renderer/store"
import { entryActions } from "@renderer/store/entry"
import { m } from "framer-motion"
import { useAtom, useAtomValue } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { debounce } from "lodash-es"
import type { FC } from "react"
import { forwardRef } from "react"
import type { ListRange } from "react-virtuoso"
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

  const virtusoOptions = {
    components: {
      List: ListContent,
    },
    overscan: window.innerHeight,
    rangeChanged: handleRangeChange,
    totalCount: entries.data?.pages?.[0]?.total,
    endReached: () => entries.hasNextPage && entries.fetchNextPage(),
    data: entries.data?.pages.flatMap((page) => page.data) || [],
    itemContent: (_, entry) => {
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
  }

  return (
    <div className="relative flex h-full flex-1 flex-col" onClick={() => setActiveEntry?.(null)}>
      <ListHeader />
      {activeList?.view && views[activeList.view].gridMode ?
          (
            <VirtuosoGrid
              listClassName="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 px-4"
              {...virtusoOptions}
            />
          ) :
          (
            <Virtuoso
              defaultItemHeight={320}
              {...virtusoOptions}
            />
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

  return (
    <div className="mb-5 flex w-full items-center justify-between pl-9 pr-2">
      <div>
        <div className="text-lg font-bold">{activeList?.name}</div>
        <div className="text-xs font-medium text-zinc-400">
          {entries.data?.pages?.[0].total}
          {" "}
          Items
        </div>
      </div>
      <Tooltip>
        <TooltipTrigger>
          <Toggle pressed={unreadOnly} onPressedChange={setUnreadOnly} className="size-8 rounded-full p-0">
            <i className="i-mingcute-round-line" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="bottom">{unreadOnly ? "Unread Only" : "All"}</TooltipContent>
      </Tooltip>
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
