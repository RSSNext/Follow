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
    <div className="max-w-[462px] select-text space-y-1 text-sm">
      <a
        href={feed.siteUrl}
        target="_blank"
        className="flex items-center"
        rel="noreferrer"
      >
        <FeedIcon
          feed={feed}
          fallbackUrl={docs}
          className="mr-2 size-8 shrink-0"
        />
        <div className="truncate text-base font-semibold leading-tight">
          {feed.title}
          <div className="truncate text-xs font-normal text-zinc-500">
            {feed.description}
          </div>
        </div>
      </a>
      <div className="flex items-center gap-1 truncate text-zinc-500">
        <i className="i-mingcute-right-line shrink-0" />
        {feed.url || docs}
      </div>
    </div>
  )
}
