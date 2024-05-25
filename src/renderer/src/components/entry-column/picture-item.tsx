import { FeedIcon } from "@renderer/components/feed-icon"
import { Image } from "@renderer/components/ui/image"
import dayjs from "@renderer/lib/dayjs"
import type { EntriesResponse } from "@renderer/lib/types"

export function PictureItem({ entry }: { entry: EntriesResponse[number] }) {
  return (
    <div>
      <div>
        <div className="flex gap-2 overflow-x-auto">
          {entry.images?.slice(0, 1).map((image) => (
            <Image
              key={image}
              src={image}
              className="aspect-square w-full shrink-0 rounded-md object-cover"
              loading="lazy"
              proxy={{
                width: 600,
                height: 600,
              }}
            />
          ))}
        </div>
        <div className="line-clamp-5 flex-1 px-2 pb-3 pt-1 text-sm">
          <div className="line-clamp-2 font-medium">{entry.title}</div>
          <div className="space-x-1 text-[13px]">
            <FeedIcon
              className="mr-0 inline-block size-3.5 align-sub"
              feed={entry.feeds}
            />
            <span>{entry.feeds.title}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-500">
              {dayjs
                .duration(
                  dayjs(entry.publishedAt).diff(dayjs(), "minute"),
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
