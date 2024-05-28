import { FeedIcon } from "@renderer/components/feed-icon"
import dayjs from "@renderer/lib/dayjs"
import type { EntriesResponse } from "@renderer/lib/types"

export function NotificationItem({
  entry,
}: {
  entry: EntriesResponse[number]
}) {
  return (
    <div className="my-5 flex px-2 py-3">
      <FeedIcon feed={entry.feeds} />
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
        <div className="my-0.5">{entry.entries.title}</div>
      </div>
    </div>
  )
}
