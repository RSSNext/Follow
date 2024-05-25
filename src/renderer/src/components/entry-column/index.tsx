import { useMainLayoutContext } from "@renderer/contexts/outlet/main-layout"
import { useEntries } from "@renderer/lib/queries/entries"
import { cn } from "@renderer/lib/utils"
import { m } from "framer-motion"

import { ArticleItem } from "./article-item"
import { EntryItemWrapper } from "./item-wrapper"
import { NotificationItem } from "./notification-item"
import { PictureItem } from "./picture-item"
import { SocialMediaItem } from "./social-media-item"
import { VideoItem } from "./video-item"

const gridMode = new Set([2, 3])

export function EntryColumn() {
  const { activeList, setActiveEntry } = useMainLayoutContext()
  const entries = useEntries({
    level: activeList?.level,
    id: activeList?.id,
    view: activeList?.view,
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
    <div className="px-2" onClick={() => setActiveEntry(null)}>
      <div className="mb-5 ml-9">
        <div className="text-lg font-bold">{activeList?.name}</div>
        <div className="text-xs font-medium text-zinc-400">
          {entries.data?.pages?.[0].total}
          {" "}
          Items
        </div>
      </div>
      <div>
        {entries.data?.pages?.map((page, index) => (
          <m.div
            key={`${activeList?.level}-${activeList?.id}-${index}`}
            initial={{ opacity: 0.01, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0.01, y: -100 }}
            className={cn(
              activeList?.view &&
              gridMode.has(activeList.view) &&
              "grid grid-cols-2 gap-2 px-2 md:grid-cols-3 lg:grid-cols-4",
            )}
          >
            {page.data?.map((entry) => (
              <EntryItemWrapper
                key={entry.id}
                entry={entry}
                view={activeList?.view}
              >
                <Item entry={entry} />
              </EntryItemWrapper>
            ))}
          </m.div>
        ))}
      </div>
    </div>
  )
}
