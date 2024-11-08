import { PlatformIcon } from "@follow/components/ui/platform-icon/index.jsx"
import type { CombinedEntryModel, FeedModel, FeedOrListRespModel } from "@follow/models/types"
import { getBackgroundGradient } from "@follow/utils/color"
import { cn, getUrlIcon } from "@follow/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { m } from "framer-motion"
import type { ReactNode } from "react"
import { forwardRef, useMemo } from "react"

import { getImageProxyUrl } from "~/lib/img-proxy"

const getFeedIconSrc = ({
  src,
  siteUrl,
  fallback,
  proxy,
}: {
  src?: string
  siteUrl?: string
  fallback?: boolean
  proxy?: { height: number; width: number }
} = {}) => {
  // src ? getProxyUrl(src) : "";
  if (src) {
    if (proxy) {
      return [
        getImageProxyUrl({
          url: src,
          width: proxy.width,
          height: proxy.height,
        }),
        "",
      ]
    }

    return [src, ""]
  }
  if (!siteUrl) return ["", ""]
  const ret = getUrlIcon(siteUrl, fallback)

  return [ret.src, ret.fallbackUrl]
}

const FallbackableImage = forwardRef<
  HTMLImageElement,
  {
    fallbackUrl: string
  } & React.ImgHTMLAttributes<HTMLImageElement>
>(function FallbackableImage({ fallbackUrl, ...rest }, ref) {
  return (
    <img
      onError={(e) => {
        if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
          e.currentTarget.src = fallbackUrl
        } else {
          rest.onError?.(e)
          // Empty svg
          e.currentTarget.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3C/svg%3E"
        }
      }}
      {...rest}
      ref={ref}
    />
  )
})

type FeedIconFeed =
  | (Pick<FeedModel, "ownerUserId" | "id" | "title" | "url" | "image"> & {
      type: FeedOrListRespModel["type"]
      siteUrl?: string
    })
  | FeedOrListRespModel

type FeedIconEntry = Pick<CombinedEntryModel["entries"], "media" | "authorAvatar">
const fadeInVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}
export function FeedIcon({
  feed,
  entry,
  fallbackUrl,
  className,
  size = 20,
  fallback = true,
  siteUrl,
  useMedia,
  disableFadeIn,
}: {
  feed?: FeedIconFeed | null
  entry?: FeedIconEntry | null
  fallbackUrl?: string
  className?: string
  size?: number
  siteUrl?: string
  /**
   * Image loading error fallback to site icon
   */
  fallback?: boolean

  useMedia?: boolean
  disableFadeIn?: boolean
}) {
  const image =
    (useMedia
      ? entry?.media?.find((i) => i.type === "photo")?.url || entry?.authorAvatar
      : entry?.authorAvatar) || feed?.image

  if (!feed && !siteUrl) {
    throw new Error("You must provide either a feed or a siteUrl")
  }

  const colors = useMemo(
    () => getBackgroundGradient(feed?.title || (feed as FeedModel)?.url || siteUrl || ""),
    [feed?.title, (feed as FeedModel)?.url, siteUrl],
  )
  let ImageElement: ReactNode
  let finalSrc = ""

  const sizeStyle: React.CSSProperties = useMemo(
    () => ({
      width: size,
      height: size,
    }),
    [size],
  )
  const colorfulStyle: React.CSSProperties = useMemo(() => {
    const [, , , bgAccent, bgAccentLight, bgAccentUltraLight] = colors
    return {
      backgroundImage: `linear-gradient(to top, ${bgAccent} 0%, ${bgAccentLight} 99%, ${bgAccentUltraLight} 100%)`,

      ...sizeStyle,
    }
  }, [colors, sizeStyle])

  const fallbackIcon = (
    <span
      style={colorfulStyle}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-sm",
        "text-white",
        "mr-2",
        className,
      )}
    >
      <span
        style={{
          fontSize: size / 2,
        }}
      >
        {!!feed?.title && feed.title[0]}
      </span>
    </span>
  )

  switch (true) {
    case !feed && !!siteUrl: {
      const [src] = getFeedIconSrc({
        siteUrl,
      })
      finalSrc = src

      ImageElement = (
        <PlatformIcon url={siteUrl} style={sizeStyle} className={cn("center mr-2", className)}>
          <m.img style={sizeStyle} {...(disableFadeIn ? {} : fadeInVariant)} />
        </PlatformIcon>
      )
      break
    }
    case !!image: {
      finalSrc = getImageProxyUrl({
        url: image,
        width: size * 2,
        height: size * 2,
      })
      ImageElement = (
        <PlatformIcon url={image} style={sizeStyle} className={cn("center mr-2", className)}>
          <m.img
            className={cn("mr-2", className)}
            style={sizeStyle}
            {...(disableFadeIn ? {} : fadeInVariant)}
          />
        </PlatformIcon>
      )
      break
    }
    case !!fallbackUrl:
    case !!(feed as FeedModel)?.siteUrl: {
      const [src, fallbackSrc] = getFeedIconSrc({
        siteUrl: (feed as FeedModel)?.siteUrl || fallbackUrl,
        fallback,
        proxy: {
          width: size * 2,
          height: size * 2,
        },
      })
      finalSrc = src

      ImageElement = (
        <PlatformIcon
          url={(feed as FeedModel)?.siteUrl || fallbackUrl}
          style={sizeStyle}
          className={cn("center mr-2", className)}
        >
          <FallbackableImage
            className={cn("mr-2", className)}
            style={sizeStyle}
            fallbackUrl={fallbackSrc}
          />
        </PlatformIcon>
      )
      break
    }
    case feed?.type === "inbox": {
      ImageElement = <i className="i-mgc-inbox-cute-fi mr-2 shrink-0" style={sizeStyle} />
      break
    }
    case !!feed?.title && !!feed.title[0]: {
      ImageElement = fallbackIcon
      break
    }
    default: {
      ImageElement = <i className="i-mgc-link-cute-re mr-2 shrink-0" style={sizeStyle} />
      break
    }
  }

  if (!ImageElement) {
    return null
  }

  if (fallback && !!finalSrc) {
    return (
      <Avatar className="shrink-0">
        <AvatarImage className="rounded-sm object-cover" asChild src={finalSrc}>
          {ImageElement}
        </AvatarImage>
        <AvatarFallback asChild>{fallbackIcon}</AvatarFallback>
      </Avatar>
    )
  }

  // Is Icon
  if (!finalSrc) return ImageElement
  // Else
  return (
    <Avatar className="shrink-0">
      <AvatarImage asChild src={finalSrc}>
        {ImageElement}
      </AvatarImage>
      <AvatarFallback>
        <div className={cn("mr-2", className)} style={sizeStyle} data-placeholder={finalSrc} />
      </AvatarFallback>
    </Avatar>
  )
}
