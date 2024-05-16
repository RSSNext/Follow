import dayjs from "@renderer/lib/dayjs"
import { EntriesResponse } from "@renderer/lib/types"
import { Image } from "@renderer/components/ui/image"
import { FeedIcon } from "@renderer/components/feed-icon"

export function ArticleItem({ entry }: { entry: EntriesResponse[number] }) {
  return (
    <div className="flex my-5 px-2 py-3">
      <FeedIcon feed={entry.feeds} />
      <div className="line-clamp-5 text-sm flex-1 -mt-0.5 leading-tight">
        <div className="text-zinc-500 text-[10px] space-x-1">
          <span>{entry.feeds.title}</span>
          <span>·</span>
          <span>
            {dayjs
              .duration(
                dayjs(entry.publishedAt).diff(dayjs(), "minute"),
                "minute",
              )
              .humanize()}
          </span>
        </div>
        <div className="font-medium my-0.5 break-words">{entry.title}</div>
        <div className="text-zinc-500 text-[13px]">{entry.description}</div>
      </div>
      {entry.images?.[0] && (
        <Image
          src={entry.images[0]}
          className="w-20 h-20 shrink-0 ml-2"
          loading="lazy"
          proxy={{
            width: 160,
            height: 160,
          }}
        />
      )}
    </div>
  )
}
