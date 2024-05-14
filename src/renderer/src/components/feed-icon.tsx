import { FeedResponse } from "@renderer/lib/types"
import { SiteIcon } from "@renderer/components/site-icon"
import { Image } from "@renderer/components/ui/image"
import { cn } from "@renderer/lib/utils"

export function FeedIcon({
  feed,
  fallbackUrl,
  className,
}: {
  feed: FeedResponse
  fallbackUrl?: string
  className?: string
}) {
  if (feed.image) {
    return (
      <Image
        src={feed.image}
        className={cn("w-5 h-5 mr-2 rounded-sm shrink-0", className)}
        proxy={{
          width: 40,
          height: 40,
        }}
      />
    )
  } else if (feed.siteUrl) {
    return <SiteIcon url={feed.siteUrl} className={className} />
  } else if (fallbackUrl) {
    return <SiteIcon url={fallbackUrl} className={className} />
  } else {
    return null
  }
}
