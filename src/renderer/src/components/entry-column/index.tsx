import { useEntries } from "@renderer/lib/queries/entries"
import { ActivedList, ActivedEntry } from "@renderer/lib/types"
import { m } from "framer-motion"
import { cn } from "@renderer/lib/utils"
import { ArticleItem } from "./article-item"
import { SocialMediaItem } from "./social-media-item"
import { PictureItem } from "./picture-item"
import { VideoItem } from "./video-item"
import { NotificationItem } from "./notification-item"
import { EntryContextMenu } from "./context-menu"

const gridMode = [2, 3]

export function EntryColumn({
  activedList,
  activedEntry,
  setActivedEntry,
}: {
  activedList: ActivedList
  activedEntry: ActivedEntry
  setActivedEntry: (value: ActivedEntry) => void
}) {
  const entries = useEntries({
    level: activedList?.level,
    id: activedList?.id,
    view: activedList?.view,
  })

  let Item
  switch (activedList?.view) {
    case 0:
      Item = ArticleItem
      break
    case 1:
      Item = SocialMediaItem
      break
    case 2:
      Item = PictureItem
      break
    case 3:
      Item = VideoItem
      break
    case 5:
      Item = NotificationItem
      break
    default:
      Item = ArticleItem
  }

  return (
    <div className="px-2" onClick={() => setActivedEntry(null)}>
      <div className="ml-9 mb-5">
        <div className="font-bold text-lg">{activedList?.name}</div>
        <div className="text-xs font-medium text-zinc-400">
          {entries.data?.pages?.[0].total} Items
        </div>
      </div>
      <div>
        {entries.data?.pages?.map((page, index) => (
          <m.div
            key={`${activedList?.level}-${activedList?.id}-${index}`}
            initial={{ opacity: 0.01, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0.01, y: -100 }}
            className={cn(
              activedList?.view &&
                gridMode.includes(activedList.view) &&
                "grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2",
            )}
          >
            {page.data?.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "rounded-md transition-colors",
                  activedEntry?.id === entry.id && "bg-[#DEDDDC]",
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  setActivedEntry(entry)
                }}
              >
                <EntryContextMenu entry={entry} view={activedList?.view}>
                  <Item entry={entry} />
                </EntryContextMenu>
              </div>
            ))}
          </m.div>
        ))}
      </div>
    </div>
  )
}
