import { SiteIcon } from "@renderer/components/site-icon"
import { Image } from "@renderer/components/ui/image"
import { cn } from "@renderer/lib/utils"
import type { CombinedEntryModel, FeedModel } from "@renderer/models"

export function FeedIcon({
  feed,
  entry,
  fallbackUrl,
  className,
  size = 20,
}: {
  feed: FeedModel
  entry?: CombinedEntryModel["entries"]
  fallbackUrl?: string
  className?: string
  size?: number
}) {
  const image = entry?.authorAvatar || feed.image
  if (image) {
    return (
      <Image
        src={image}
        className={cn("mr-2 shrink-0 rounded-sm", className)}
        style={{
          width: size,
          height: size,
        }}
        proxy={{
          width: size * 2,
          height: size * 2,
        }}
      />
    )
  } else if (feed.siteUrl) {
    return (
      <SiteIcon
        url={feed.siteUrl}
        className={className}
        style={{
          width: size,
          height: size,
        }}
      />
    )
  } else if (fallbackUrl) {
    return (
      <SiteIcon
        url={fallbackUrl}
        className={className}
        style={{
          width: size,
          height: size,
        }}
      />
    )
  } else {
    return null
  }
}
