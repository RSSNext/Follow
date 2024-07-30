import { cn } from "@renderer/lib/utils"
import { parse } from "tldts"

import { PlatformIcon } from "./ui/platform-icon"

export function SiteIcon({
  url,
  className,
  style,
}: {
  url?: string
  className?: string
  style?: React.CSSProperties
}) {
  let host
  let src
  let fallback

  if (!url) return null

  try {
    host = new URL(url).host
    const pureDomain = parse(host).domainWithoutSuffix
    fallback = `https://avatar.vercel.sh/${pureDomain}.svg?text=${pureDomain
      ?.slice(0, 2)
      .toUpperCase()}`
    src = `https://unavatar.follow.is/${host}?fallback=${fallback}`
  } catch {
    const pureDomain = parse(url).domainWithoutSuffix
    src = `https://avatar.vercel.sh/${pureDomain}.svg?text=${pureDomain
      ?.slice(0, 2)
      .toUpperCase()}`
  }

  return (
    <PlatformIcon
      url={url}
      style={style}
      className={cn("mr-2 size-5 shrink-0 rounded-sm", className)}
    >
      <img
        src={src}
        loading="lazy"
        onError={(e) => {
          if (fallback && e.currentTarget.src !== fallback) {
            e.currentTarget.src = fallback
          } else {
            // Empty svg
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3C/svg%3E"
          }
        }}
      />
    </PlatformIcon>
  )
}
