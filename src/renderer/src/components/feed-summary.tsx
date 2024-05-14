import { FeedResponse } from "@renderer/lib/types"
import { FeedIcon } from "@renderer/components/feed-icon"

export function FollowSummary({
  feed,
  docs,
}: {
  feed: FeedResponse
  docs?: string
}) {
  return (
    <div className="select-text text-sm space-y-1 max-w-[462px]">
      <a href={feed.siteUrl} target="_blank" className="flex items-center">
        <FeedIcon
          feed={feed}
          fallbackUrl={docs}
          className="w-8 h-8 mr-2 shrink-0"
        />
        <div className="leading-tight font-semibold text-base truncate">
          {feed.title}
          <div className="font-normal truncate text-xs text-zinc-500">
            {feed.description}
          </div>
        </div>
      </a>
      <div className="text-zinc-500 flex items-center gap-1 truncate">
        <i className="i-mingcute-right-line shrink-0" />
        {feed.url || docs}
      </div>
    </div>
  )
}
