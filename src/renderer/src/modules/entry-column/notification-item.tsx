import { FeedIcon } from "@renderer/components/feed-icon"
import { useAsRead } from "@renderer/hooks"
import dayjs from "@renderer/lib/dayjs"
import { cn } from "@renderer/lib/utils"
import { EntryTranslation } from "@renderer/modules/entry-column/translation"
import { useEntry } from "@renderer/store/entry/hooks"

import { ReactVirtuosoItemPlaceholder } from "../../components/ui/placeholder"
import type { UniversalItemProps } from "./types"

export function NotificationItem({ entryId, entryPreview, translation }: UniversalItemProps) {
  const entry = useEntry(entryId) || entryPreview

  const asRead = useAsRead(entry)

  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return (
    <div className={cn("relative flex px-2 py-3", !asRead && "before:absolute before:-left-1 before:top-[18px] before:block before:size-2 before:rounded-full before:bg-blue-500")}>
      <FeedIcon feed={entry.feeds} entry={entry.entries} />
      <div className="-mt-0.5 line-clamp-5 flex-1 text-sm leading-tight">
        <div className={cn("flex gap-1 text-[10px] font-bold", asRead ? "text-zinc-400" : "text-zinc-500")}>
          <span className="truncate">{entry.feeds.title}</span>
          <span>·</span>
          <span>
            {dayjs
              .duration(
                dayjs(entry.entries.publishedAt).diff(dayjs(), "minute"),
                "minute",
              )
              .humanize()}
          </span>
        </div>
        <div className={cn("relative my-0.5", !!entry.collections && "pr-4")}>
          <EntryTranslation source={entry.entries.title} target={translation?.title} />
          {!!entry.collections && (
            <i className="i-mgc-star-cute-fi absolute right-0 top-0.5 text-orange-400" />
          )}
        </div>
      </div>
    </div>
  )
}
