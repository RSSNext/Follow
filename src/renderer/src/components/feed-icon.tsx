import { SiteIcon } from "@renderer/components/site-icon"
import { Image } from "@renderer/components/ui/image"
import { cn } from "@renderer/lib/utils"
import type { EntryModel, FeedModel } from "@renderer/models"

export function FeedIcon({
  feed,
  entry,
  fallbackUrl,
  className,
}: {
  feed: FeedModel
  entry?: EntryModel["entries"]
  fallbackUrl?: string
  className?: string
}) {
  const image = entry?.authorAvatar || feed.image
  if (image) {
    return (
      <Image
        src={image}
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
