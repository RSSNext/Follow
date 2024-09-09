import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { getColorScheme, stringToHue } from "@renderer/lib/color"
import { getProxyUrl } from "@renderer/lib/img-proxy"
import { cn, getUrlIcon } from "@renderer/lib/utils"
import type { CombinedEntryModel, FeedModel } from "@renderer/models"
import type { ReactNode } from "react"
import { forwardRef, useMemo } from "react"

import { PlatformIcon } from "./ui/platform-icon"

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
        getProxyUrl({
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

export function FeedIcon({
  feed,
  entry,
  fallbackUrl,
  className,
  size = 20,
  fallback = true,
  siteUrl,
}: {
  feed?: FeedModel
  entry?: CombinedEntryModel["entries"]
  fallbackUrl?: string
  className?: string
  size?: number
  siteUrl?: string
  /**
   * Image loading error fallback to site icon
   */
  fallback?: boolean
}) {
  const image = entry?.authorAvatar || feed?.image

  if (!feed && !siteUrl) {
    throw new Error("You must provide either a feed or a siteUrl")
  }

  const colors = useMemo(
    () => getColorScheme(stringToHue(feed?.title || feed?.url || siteUrl!), true),
    [feed?.title, feed?.url, siteUrl],
  )
  let ImageElement: ReactNode
  let finalSrc = ""

  const sizeStyle = {
    width: size,
    height: size,
  }

  switch (true) {
    case !feed && !!siteUrl: {
      const [src] = getFeedIconSrc({
        siteUrl,
      })
      finalSrc = src

      ImageElement = (
        <PlatformIcon url={siteUrl} style={sizeStyle} className={cn("center mr-2", className)}>
          <img style={sizeStyle} />
        </PlatformIcon>
      )
      break
    }
    case !!image: {
      finalSrc = getProxyUrl({
        url: image,
        width: size * 2,
        height: size * 2,
      })
      ImageElement = (
        <PlatformIcon url={image} style={sizeStyle} className={cn("center mr-2", className)}>
          <img className={cn("mr-2", className)} style={sizeStyle} />
        </PlatformIcon>
      )
      break
    }
    case !!fallbackUrl:
    case !!feed?.siteUrl: {
      const [src, fallbackSrc] = getFeedIconSrc({
        siteUrl: feed?.siteUrl || fallbackUrl,
        fallback,
        proxy: {
          width: size * 2,
          height: size * 2,
        },
      })
      finalSrc = src

      ImageElement = (
        <PlatformIcon
          url={feed?.siteUrl!}
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
        <AvatarImage
          className="rounded-sm duration-200 animate-in fade-in-0"
          asChild
          src={finalSrc}
        >
          {ImageElement}
        </AvatarImage>
        <AvatarFallback asChild>
          <span
            style={
              {
                ...sizeStyle,
                "--fo-light-background": colors.light.background,
                "--fo-dark-background": colors.dark.background,
              } as any
            }
            className={cn(
              "flex shrink-0 items-center justify-center rounded-sm",
              "bg-[var(--fo-light-background)] text-white dark:bg-[var(--fo-dark-background)]",
              "mr-2",
              className,
            )}
          >
            <span className="text-[9px]">{!!feed?.title && feed.title[0]}</span>
          </span>
        </AvatarFallback>
      </Avatar>
    )
  }

  // Is Icon
  if (!finalSrc) return ImageElement
  // Else
  return (
    <Avatar className="shrink-0">
      <AvatarImage className="duration-200 animate-in fade-in-0" asChild src={finalSrc}>
        {ImageElement}
      </AvatarImage>
      <AvatarFallback>
        <div className={cn("mr-2", className)} style={sizeStyle} data-placeholder={finalSrc} />
      </AvatarFallback>
    </Avatar>
  )
}
