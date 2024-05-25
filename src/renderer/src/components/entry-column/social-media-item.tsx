import dayjs from "@renderer/lib/dayjs"
import { EntriesResponse } from "@renderer/lib/types"
import { Image } from "@renderer/components/ui/image"
import { FeedIcon } from "@renderer/components/feed-icon"

export function SocialMediaItem({ entry }: { entry: EntriesResponse[number] }) {
  return (
    <div className="my-5 flex px-2 py-3">
      <FeedIcon feed={entry.feeds} />
      <div>
        <div className="-mt-0.5 line-clamp-5 flex-1 text-sm">
          <div className="space-x-1">
            <span className="font-medium">{entry.author}</span>
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
          <div className="mt-0.5">{entry.description}</div>
        </div>
        <div className="mt-1 flex gap-2 overflow-x-auto">
          {entry.images?.map((image) => (
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
