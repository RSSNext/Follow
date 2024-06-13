import { EntryTranslation } from "@renderer/components/entry-column/translation"
import { FeedIcon } from "@renderer/components/feed-icon"
import dayjs from "@renderer/lib/dayjs"
import { cn } from "@renderer/lib/utils"
import { useEntry } from "@renderer/store/entry/hooks"

import { ReactVirtuosoItemPlaceholder } from "../ui/placeholder"
import type { UniversalItemProps } from "./types"

export function AudioItem({ entryId, entryPreview, translation }: UniversalItemProps) {
  const entry = useEntry(entryId) || entryPreview
  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return (
    <div className="flex px-2 py-4">
      <FeedIcon feed={entry.feeds} entry={entry.entries} />
      <div className="-mt-0.5 line-clamp-5 flex-1 text-sm leading-tight">
        <div className="space-x-1 text-[10px] text-zinc-500">
          <span>{entry.feeds.title}</span>
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
            <i className="i-mingcute-star-fill absolute right-0 top-0.5 text-orange-400" />
          )}
        </div>
        {entry.entries?.enclosures?.[0].url && (
          <audio className="mt-2 h-10 w-full" controls src={entry.entries?.enclosures?.[0].url} />
        )}
      </div>
    </div>
  )
}
