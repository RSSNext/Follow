import { FeedIcon } from "@renderer/components/feed-icon"
import { SwipeImages } from "@renderer/components/swipe-images"
import { ReactVirtuosoItemPlaceholder } from "@renderer/components/ui/placeholder"
import dayjs from "@renderer/lib/dayjs"
import { cn } from "@renderer/lib/utils"
import { useEntry } from "@renderer/store/entry"

import type { UniversalItemProps } from "./types"

export function PictureItem({ entryId, entryPreview }: UniversalItemProps) {
  const entry = useEntry(entryId) || entryPreview
  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return (
    <div>
      <div>
        <div className="relative flex gap-2 overflow-x-auto">
          <SwipeImages
            images={entry.entries.images}
            className="aspect-square w-full shrink-0 rounded-md"
            imgClassName="object-cover"
            uniqueKey={entryId}
          />
        </div>
        <div className="flex-1 px-2 pb-3 pt-1 text-sm">
          <div className={cn("relative mb-0.5 mt-1 truncate font-medium", !!entry.collections && "pr-4")}>
            {entry.entries.title}
            {!!entry.collections && (
              <i className="i-mingcute-star-fill absolute right-0 top-0.5 text-orange-400" />
            )}
          </div>
          <div className="flex items-center gap-1 truncate text-[13px]">
            <FeedIcon
              className="mr-0.5 inline-block size-[18px]"
              feed={entry.feeds}
            />
            <span>{entry.feeds.title}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-500">
              {dayjs
                .duration(
                  dayjs(entry.entries.publishedAt).diff(dayjs(), "minute"),
                  "minute",
                )
                .humanize()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
