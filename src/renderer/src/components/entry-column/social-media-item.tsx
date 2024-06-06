import { FeedIcon } from "@renderer/components/feed-icon"
import { Image } from "@renderer/components/ui/image"
import dayjs from "@renderer/lib/dayjs"
import { cn } from "@renderer/lib/utils"
import { useEntry } from "@renderer/store/entry"

import { ReactVirtuosoItemPlaceholder } from "../ui/placeholder"
import type { UniversalItemProps } from "./types"

export function SocialMediaItem({ entryId, entryPreview }: UniversalItemProps) {
  const entry = useEntry(entryId) || entryPreview

  // NOTE: prevent 0 height element, react virtuoso will not stop render any more
  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return (
    <div className="flex w-full px-2 py-3">
      <FeedIcon feed={entry.feeds} entry={entry.entries} />
      <div className="min-w-0 flex-1">
        <div className="-mt-0.5 line-clamp-5 flex-1 text-sm">
          <div className="space-x-1">
            <span className="font-medium">{entry.entries.author}</span>
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
          <div className={cn("relative mt-0.5", !!entry.collections && "pr-4")}>
            {entry.entries.description}
            {!!entry.collections && (
              <i className="i-mingcute-star-fill absolute right-0 top-0.5 text-orange-400" />
            )}
          </div>
        </div>
        <div className="mt-1 flex gap-2 overflow-x-auto">
          {entry.entries.images?.map((image) => (
            <Image
              key={image}
              src={image}
              className="size-28 shrink-0"
              loading="lazy"
              proxy={{
                width: 224,
                height: 224,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
