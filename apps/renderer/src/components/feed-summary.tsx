import { FeedIcon } from "~/components/feed-icon"
import { cn } from "~/lib/utils"
import type { FeedModel } from "~/models"

import { FeedCertification } from "./feed-certification"
import { EllipsisHorizontalTextWithTooltip } from "./ui/typography"

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
    <div className={cn("flex select-text flex-col gap-2 text-sm", className)}>
      <a
        href={feed.siteUrl || void 0}
        target="_blank"
        className="flex items-center"
        rel="noreferrer"
      >
        <FeedIcon
          feed={feed}
          fallbackUrl={docs}
          className="mask-squircle mask mr-3 shrink-0 rounded-none"
          size={32}
        />
        <div className="truncate text-base font-semibold leading-tight">
          <div className="flex items-center gap-1">
            {feed.title}
            <FeedCertification feed={feed} />
          </div>
          <EllipsisHorizontalTextWithTooltip className="truncate text-xs font-normal text-zinc-500">
            {feed.description}
          </EllipsisHorizontalTextWithTooltip>
        </div>
      </a>
      <div className="flex items-center gap-1 truncate text-zinc-500">
        <i className="i-mgc-right-cute-re shrink-0" />
        <a href={feed.url || docs} target="_blank" rel="noreferrer">
          {feed.url || docs}
        </a>
      </div>
    </div>
  )
}
