import { FeedIcon } from "@renderer/components/feed-icon"
import { Image } from "@renderer/components/ui/image"
import dayjs from "@renderer/lib/dayjs"

import type { UniversalItemProps } from "./types"

export function SocialMediaItem({ entry }: UniversalItemProps) {
  return (
    <div className="mb-5 flex px-2 py-3 w-full">
      <FeedIcon feed={entry.feeds} />
      <div className="flex-1 min-w-0">
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
          <div className="mt-0.5">{entry.entries.description}</div>
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
