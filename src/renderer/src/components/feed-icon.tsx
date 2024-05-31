import { SiteIcon } from "@renderer/components/site-icon"
import { Image } from "@renderer/components/ui/image"
import type { FeedModel } from "@renderer/lib/types"
import { cn } from "@renderer/lib/utils"

export function FeedIcon({
  feed,
  fallbackUrl,
  className,
}: {
  feed: FeedModel
  fallbackUrl?: string
  className?: string
}) {
  if (feed.image) {
    return (
      <Image
        src={feed.image}
        className={cn("mr-2 size-5 shrink-0 rounded-sm", className)}
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
