import { Tabs, TabsList, TabsTrigger } from "@renderer/components/ui/tabs"
import { cn } from "@renderer/lib/utils"
import { useEntries } from "@renderer/queries/entries"
import { useFeedStore } from "@renderer/store"
import { m } from "framer-motion"
import { useState } from "react"
import { Virtuoso } from "react-virtuoso"

import { ArticleItem } from "./article-item"
import { EntryItemWrapper } from "./item-wrapper"
import { NotificationItem } from "./notification-item"
import { PictureItem } from "./picture-item"
import { SocialMediaItem } from "./social-media-item"
import { VideoItem } from "./video-item"

const gridMode = new Set([2, 3])

export function EntryColumn() {
  const [filterTab, setFilterTab] = useState("unread")

  const activeList = useFeedStore((state) => state.activeList)
  const entries = useEntries({
    level: activeList?.level,
    id: activeList?.id,
    view: activeList?.view,
    ...(filterTab === "unread" && { read: false }),
  })

  let Item
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

  return (
    <div className="px-2 h-full flex flex-col">
      <div className="mb-5 px-9 flex justify-between items-center w-full">
        <div>
          <div className="text-lg font-bold">{activeList?.name}</div>
          <div className="text-xs font-medium text-zinc-400">
            {entries.data?.pages?.[0].total}
            {" "}
            Items
          </div>
        </div>
        <Tabs value={filterTab} onValueChange={setFilterTab}>
          <TabsList variant="rounded">
            <TabsTrigger variant="rounded" value="unread">Unread</TabsTrigger>
            <TabsTrigger variant="rounded" value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1">
        <m.div
          key={`${activeList?.level}-${activeList?.id}`}
          initial={{ opacity: 0.01, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0.01, y: -100 }}
          className={cn(
            "h-full",
            activeList?.view &&
            gridMode.has(activeList.view) &&
            "grid grid-cols-2 gap-2 px-2 md:grid-cols-3 lg:grid-cols-4",
          )}
        >
          <Virtuoso
            endReached={() =>
              entries.hasNextPage && entries.fetchNextPage()}
            data={entries.data?.pages}
            itemContent={(_, page) => page?.data?.map((entry) => (
              <EntryItemWrapper
                key={entry.entries.id}
                entry={entry}
                view={activeList?.view}
              >
                <Item entry={entry} />
              </EntryItemWrapper>
            ))}
          />
        </m.div>
      </div>
    </div>
  )
}
