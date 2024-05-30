import { Tabs, TabsList, TabsTrigger } from "@renderer/components/ui/tabs"
import { buildStorageNS } from "@renderer/lib/ns"
import { cn } from "@renderer/lib/utils"
import { apiClient } from "@renderer/queries/api-fetch"
import { useEntries } from "@renderer/queries/entries"
import { useFeedStore } from "@renderer/store"
import { entryActions } from "@renderer/store/entry"
import { m } from "framer-motion"
import { useAtom, useAtomValue } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { debounce } from "lodash-es"
import type { FC } from "react"
import { forwardRef } from "react"
import type { ListRange } from "react-virtuoso"
import { Virtuoso } from "react-virtuoso"
import { useEventCallback } from "usehooks-ts"
import { useShallow } from "zustand/react/shallow"

import { ArticleItem } from "./article-item"
import { EntryItemWrapper } from "./item-wrapper"
import { NotificationItem } from "./notification-item"
import { PictureItem } from "./picture-item"
import { SocialMediaItem } from "./social-media-item"
import type { FilterTab, UniversalItemProps } from "./types"
import { VideoItem } from "./video-item"
import { gridMode } from "@renderer/lib/constants"

const filterTabAtom = atomWithStorage<FilterTab>(
  buildStorageNS("entry-tab"),
  "unread",
)
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

  return (
    <div className="relative flex h-full flex-1 flex-col">
      <ListHeader />
      <Virtuoso
        className="h-0 grow"
        components={{
          List: ListContent,
        }}
        defaultItemHeight={320}
        overscan={window.innerHeight}
        rangeChanged={handleRangeChange}
        totalCount={entriesIds?.length}
        endReached={() => entries.hasNextPage && entries.fetchNextPage()}
        data={entries.data?.pages.flatMap((page) => page.data)}
        itemContent={(_, entry) => {
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
        }}
      />
    </div>
  )
}

const useEntriesByTab = () => {
  const activeList = useFeedStore(useShallow((state) => state.activeList))
  const filterTab = useAtomValue(filterTabAtom)

  return useEntries({
    level: activeList?.level,
    id: activeList?.id,
    view: activeList?.view,
    ...(filterTab === "unread" && { read: false }),
  })
}

const ListHeader: FC = () => {
  const activeList = useFeedStore(useShallow((state) => state.activeList))
  const [filterTab, setFilterTab] = useAtom(filterTabAtom)
  const entries = useEntriesByTab()
  const total = entries.data?.pages?.reduce(
    (acc, page) => acc + (page.data?.length || 0),
    0,
  )
  return (
    <div className="mb-5 flex w-full items-center justify-between px-9">
      <div>
        <div className="text-lg font-bold">{activeList?.name}</div>
        <div className="text-xs font-medium text-zinc-400">
          {total}
          {" "}
          Items
        </div>
      </div>
      {/* @ts-expect-error */}
      <Tabs value={filterTab} onValueChange={setFilterTab}>
        <TabsList variant="rounded">
          <TabsTrigger variant="rounded" value="unread">
            Unread
          </TabsTrigger>
          <TabsTrigger variant="rounded" value="all">
            All
          </TabsTrigger>
        </TabsList>
      </Tabs>
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
      className={cn(
        "h-full px-2",
        activeList?.view &&
        gridMode.has(activeList.view) &&
        "grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4",
      )}
      {...props}
      ref={ref}
    />
  )
})
