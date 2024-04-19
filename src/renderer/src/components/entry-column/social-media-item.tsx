import dayjs from "@renderer/lib/dayjs"
import { SiteIcon } from "@renderer/components/site-icon"

export function SocialMediaItem({ entry }: { entry: any }) {
  return (
    <div className="flex my-5 px-2 py-3">
      <SiteIcon url={entry.feed.site_url} />
      <div>
        <div className="line-clamp-5 text-sm flex-1 -mt-0.5">
          <div className="space-x-1">
            <span className="font-medium">{entry.author}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-500">
              {dayjs
                .duration(
                  dayjs(entry.published_at).diff(dayjs(), "minute"),
                  "minute",
                )
                .humanize()}
            </span>
          </div>
          <div className="mt-0.5">{entry.text}</div>
        </div>
        <div className="flex gap-2 overflow-x-auto mt-1">
          {entry.images?.map((image) => (
            <img
              key={image}
              src={image}
              className="w-28 h-28 shrink-0 rounded object-cover"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
