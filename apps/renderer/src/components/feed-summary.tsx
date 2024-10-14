import { WEB_URL } from "@follow/shared/constants"
import { env } from "@follow/shared/env"

import { FeedIcon } from "~/components/feed-icon"
import { cn } from "~/lib/utils"
import type { FeedOrListRespModel } from "~/models"

import { FeedCertification } from "./feed-certification"
import { EllipsisHorizontalTextWithTooltip } from "./ui/typography"

export function FollowSummary({
  feed,
  docs,
  className,
}: {
  feed: FeedOrListRespModel
  docs?: string
  className?: string
}) {
  let siteLink: string | undefined
  let feedLink: string | undefined
  let feedTitle = feed.title
  let feedText: string | undefined

  switch (feed.type) {
    case "list": {
      siteLink = `${WEB_URL}/list/${feed.id}`
      feedLink = siteLink
      feedText = `/list/${feed.id}`
      break
    }
    case "inbox": {
      siteLink = void 0
      feedLink = siteLink
      feedText = `${feed.id}${env.VITE_INBOXES_EMAIL}`
      feedTitle = feed.title || `${feed.id}'s Inbox`
      break
    }
    default: {
      siteLink = feed.siteUrl || void 0
      feedLink = feed.url || docs
      feedText = feed.url || docs
      break
    }
  }

  return (
    <div className={cn("flex select-text flex-col gap-2 text-sm", className)}>
      <a href={siteLink} target="_blank" className="flex items-center" rel="noreferrer">
        <FeedIcon
          feed={feed}
          fallbackUrl={docs}
          className="mask-squircle mask mr-3 shrink-0 rounded-none"
          size={32}
        />
        <div className="truncate text-base font-semibold leading-tight">
          <div className="flex items-center">
            {feedTitle}
            <FeedCertification className="center" feed={feed} />
          </div>
          <EllipsisHorizontalTextWithTooltip className="truncate text-xs font-normal text-zinc-500">
            {feed.description}
          </EllipsisHorizontalTextWithTooltip>
        </div>
      </a>
      <div className="flex items-center gap-1 truncate text-zinc-500">
        <i className="i-mgc-right-cute-re shrink-0" />
        <a href={feedLink} target="_blank" rel="noreferrer" className="truncate">
          <EllipsisHorizontalTextWithTooltip>{feedText}</EllipsisHorizontalTextWithTooltip>
        </a>
      </div>
    </div>
  )
}
