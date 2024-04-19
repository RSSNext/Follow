import dayjs from "@renderer/lib/dayjs"
import { SiteIcon } from "../site-icon"

export function NotificationItem({ entry }: { entry: any }) {
  return (
    <div className="flex my-5 px-2 py-3">
      <SiteIcon url={entry.feed.site_url} />
      <div className="line-clamp-5 text-sm flex-1 -mt-0.5 leading-tight">
        <div className="text-zinc-500 text-[10px] space-x-1">
          <span>{entry.feed.title}</span>
          <span>·</span>
          <span>
            {dayjs
              .duration(
                dayjs(entry.published_at).diff(dayjs(), "minute"),
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
