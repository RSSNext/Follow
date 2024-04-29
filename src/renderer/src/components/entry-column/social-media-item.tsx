import dayjs from "@renderer/lib/dayjs"
import { SiteIcon } from "@renderer/components/site-icon"
import { EntriesResponse } from "@renderer/lib/types"
import { Image } from "@renderer/components/ui/image"

export function SocialMediaItem({ entry }: { entry: EntriesResponse[number] }) {
  return (
    <div className="flex my-5 px-2 py-3">
      <SiteIcon url={entry.feeds.siteUrl} />
      <div>
        <div className="line-clamp-5 text-sm flex-1 -mt-0.5">
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
        <div className="flex gap-2 overflow-x-auto mt-1">
          {entry.images?.map((image) => (
            <Image
              key={image}
              src={image}
              className="w-28 h-28 shrink-0"
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
