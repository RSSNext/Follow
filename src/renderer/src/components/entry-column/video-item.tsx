import { FeedIcon } from "@renderer/components/feed-icon"
import { Image } from "@renderer/components/ui/image"
import dayjs from "@renderer/lib/dayjs"
import { useEntry } from "@renderer/store/entry"

import { ReactVirtuosoItemPlaceholder } from "../ui/placeholder"
import type { UniversalItemProps } from "./types"

export function VideoItem({ entryId, entryPreview }: UniversalItemProps) {
  const entry = useEntry(entryId) || entryPreview
  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return (
    <div className="flex">
      <div className="w-full">
        <div className="flex gap-2 overflow-x-auto">
          <Image
            key={entry.entries.images?.[0]}
            src={entry.entries.images?.[0]}
            className="aspect-video w-full shrink-0 rounded-md object-cover"
            loading="lazy"
            proxy={{
              width: 640,
              height: 360,
            }}
            disableContextMenu
          />
        </div>
        <div className="flex-1 px-2 pb-3 pt-1 text-sm">
          <div className="mb-0.5 mt-1 truncate font-medium">{entry.entries.title}</div>
          <div className="flex items-center gap-1 truncate text-xs">
            <FeedIcon
              className="mr-0.5 inline-block size-3"
              feed={entry.feeds}
            />
            <span>{entry.entries.author}</span>
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
