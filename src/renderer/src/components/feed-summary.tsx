import { FeedIcon } from "@renderer/components/feed-icon"
import type { FeedModel } from "@renderer/lib/types"
import { cn } from "@renderer/lib/utils"

export function FollowSummary({
  feed,
  docs,
  className,
}: {
  feed: FeedModel
  docs?: string
  className?: string
}) {
  return (
    <div className={cn("select-text space-y-1 text-sm", className)}>
      <a
        href={feed.siteUrl || void 0}
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
