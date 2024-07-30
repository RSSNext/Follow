import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { SiteIcon } from "@renderer/components/site-icon"
import { Media } from "@renderer/components/ui/media"
import { getColorScheme, stringToHue } from "@renderer/lib/color"
import { cn } from "@renderer/lib/utils"
import type { CombinedEntryModel, FeedModel } from "@renderer/models"
import type { ReactNode } from "react"
import { useMemo } from "react"

export function FeedIcon({
  feed,
  entry,
  fallbackUrl,
  className,
  size = 20,
  fallback = false,
}: {
  feed: FeedModel
  entry?: CombinedEntryModel["entries"]
  fallbackUrl?: string
  className?: string
  size?: number
  /**
   * Image loading error fallback to site icon
   */
  fallback?: boolean
}) {
  const image = entry?.authorAvatar || feed.image

  let ImageElement: ReactNode

  switch (true) {
    case !!image: {
      ImageElement = (
        <Media
          src={image}
          type="photo"
          loading="lazy"
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
      break
    }
    case !!fallbackUrl:
    case !!feed.siteUrl: {
      ImageElement = (
        <SiteIcon
          fallbackText={feed.title!}
          fallback={fallback}
          url={feed.siteUrl || fallbackUrl}
          className={className}
          style={{
            width: size,
            height: size,
          }}
        />
      )
      break
    }
  }

  const colors = useMemo(
    () => getColorScheme(stringToHue(feed.title || feed.url), true),
    [feed.title, feed.url],
  )

  if (!ImageElement) {
    return null
  }

  if (fallback && !!image) {
    return (
      <Avatar>
        <AvatarImage src={image || ""} asChild>
          {ImageElement}
        </AvatarImage>
        <AvatarFallback asChild>
          <span
            style={
              {
                "width": size,
                "height": size,

                "--fo-light-background": colors.light.background,
                "--fo-dark-background": colors.dark.background,
              } as any
            }
            className={cn(
              "mr-2 inline-flex shrink-0 items-center justify-center rounded-sm text-xs font-medium",
              "bg-[var(--fo-light-background)] text-white dark:bg-[var(--fo-dark-background)] dark:text-black",
              className,
            )}
          >
            {!!feed.title && feed.title[0]}
          </span>
        </AvatarFallback>
      </Avatar>
    )
  }

  return ImageElement
}
