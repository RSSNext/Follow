import type { FeedViewType } from "@follow/constants"
import type { ImageProps } from "expo-image"
import type { ReactNode } from "react"
import { useMemo } from "react"

import type { FeedSchema } from "@/src/database/schemas/types"
import { getFeedIconSource } from "@/src/lib/image"

import { ProxiedImage } from "../image/ProxiedImage"

export type FeedIconRequiredFeed = Pick<
  FeedSchema,
  "ownerUserId" | "id" | "title" | "url" | "image"
> & {
  type: FeedViewType
  siteUrl?: string
}
export type FeedIconFeed = FeedIconRequiredFeed | FeedSchema

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
    return getFeedIconSource(feed, siteUrl, fallback)
  }, [fallback, feed, siteUrl])

  if (!src) {
    return null
  }
  return (
    <ProxiedImage
      proxy={{
        width: size,
        height: size,
      }}
      className="rounded"
      style={{ height: size, width: size }}
      source={src}
      {...props}
    />
  )
}
