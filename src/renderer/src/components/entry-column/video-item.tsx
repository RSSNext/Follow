import { FeedIcon } from "@renderer/components/feed-icon"
import { Image } from "@renderer/components/ui/image"
import dayjs from "@renderer/lib/dayjs"
import type { EntriesResponse } from "@renderer/lib/types"

export function VideoItem({ entry }: { entry: EntriesResponse[number] }) {
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
          />
        </div>
        <div className="line-clamp-5 flex-1 px-2 pb-3 pt-1 text-sm">
          <div className="line-clamp-2 font-medium">{entry.entries.title}</div>
          <div className="space-x-1 text-[13px]">
            <FeedIcon
              className="mr-0 inline-block size-3.5 align-sub"
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
