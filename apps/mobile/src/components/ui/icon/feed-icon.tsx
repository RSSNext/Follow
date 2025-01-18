import type { FeedViewType } from "@follow/constants"
import { getUrlIcon } from "@follow/utils/src/utils"
import type { ImageProps } from "expo-image"
import { Image } from "expo-image"
import type { ReactNode } from "react"
import { useMemo } from "react"

import type { FeedSchema } from "@/src/database/schemas/types"

export type FeedIconRequiredFeed = Pick<
  FeedSchema,
  "ownerUserId" | "id" | "title" | "url" | "image"
> & {
  type: FeedViewType
  siteUrl?: string
}
type FeedIconFeed = FeedIconRequiredFeed | FeedSchema

const getFeedIconSrc = (siteUrl: string, fallback: boolean) => {
  const ret = getUrlIcon(siteUrl, fallback)

  return [ret.src, ret.fallbackUrl]
}
interface FeedIconProps {
  feed?: FeedIconFeed
  fallbackUrl?: string
  className?: string
  size?: number
  siteUrl?: string
  /**
   * Image loading error fallback to site icon
   */
  fallback?: boolean
  fallbackElement?: ReactNode
}
export function FeedIcon({
  feed,
  fallbackUrl,
  className,
  size = 20,
  fallback = true,
  fallbackElement,
  siteUrl,
  ...props
}: FeedIconProps & ImageProps) {
  const src = useMemo(() => {
    switch (true) {
      case !feed && !!siteUrl: {
        const [src] = getFeedIconSrc(siteUrl, fallback)
        return src
      }
      case !!feed && !!feed.image: {
        return feed.image
      }
      case !!feed && !feed.image && !!feed.siteUrl: {
        const [src] = getFeedIconSrc(feed.siteUrl, fallback)
        return src
      }
    }
  }, [fallback, feed, siteUrl])

  return <Image style={{ height: size, width: size }} source={src} {...props} />
}
