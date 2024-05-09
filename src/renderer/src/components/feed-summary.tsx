import { FeedResponse } from "@renderer/lib/types"
import { SiteIcon } from "@renderer/components/site-icon"
import { Image } from "@renderer/components/ui/image"

export function FollowSummary({
  feed,
  docs,
}: {
  feed: Partial<FeedResponse>
  docs?: string
}) {
  return (
    <div className="select-text text-sm space-y-1">
      <a href={feed.siteUrl} target="_blank" className="flex items-center">
        {(() => {
          if (feed.image) {
            return <Image src={feed.image} className="w-8 h-8 mr-2" />
          } else if (feed.siteUrl) {
            return <SiteIcon url={feed.siteUrl} className="w-8 h-8" />
          } else if (docs) {
            return <SiteIcon url="https://rsshub.app" className="w-8 h-8" />
          } else {
            return null
          }
        })()}
        <div className="leading-tight font-semibold text-base">
          {feed.title}
          <div className="font-normal truncate text-xs text-zinc-500">
            {feed.description}
          </div>
        </div>
      </a>
      <div className="text-zinc-500 flex items-center gap-1">
        <i className="i-mingcute-right-line" />
        {feed.url || docs}
      </div>
    </div>
  )
}
