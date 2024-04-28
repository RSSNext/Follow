import dayjs from "@renderer/lib/dayjs"
import { SiteIcon } from "../site-icon"
import { EntriesResponse } from "@renderer/lib/types"

export function NotificationItem({
  entry,
}: {
  entry: EntriesResponse[number]
}) {
  return (
    <div className="flex my-5 px-2 py-3">
      <SiteIcon url={entry.feeds.siteUrl} />
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
        <div className="my-0.5">{entry.title}</div>
      </div>
    </div>
  )
}
