import type { FeedViewType } from "@follow/constants"
import { getUrlIcon } from "@follow/utils/src/utils"
import type { ReactNode } from "react"
import { useMemo } from "react"
import type { ImageProps } from "react-native"
import { Image } from "react-native"

import type { FeedModel } from "@/src/database/schemas/types"

type FeedIconFeed =
  | (Pick<FeedModel, "ownerUserId" | "id" | "title" | "url" | "image"> & {
      type: FeedViewType
      siteUrl?: string
    })
  | FeedModel

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

  return <Image height={size} width={size} source={{ uri: src }} {...props} />
}
