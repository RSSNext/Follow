import { cn } from "@renderer/lib/utils"
import { parse } from "tldts"

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
    fallback = `https://avatar.vercel.sh/${pureDomain}.svg?text=${pureDomain?.slice(0, 2).toUpperCase()}`
    src = `https://unavatar.io/${host}?fallback=${fallback}`
  } catch {
    const pureDomain = parse(url).domainWithoutSuffix
    src = `https://avatar.vercel.sh/${pureDomain}.svg?text=${pureDomain?.slice(0, 2).toUpperCase()}`
  }

  return (
    <img
      src={src}
      className={cn("mr-2 size-5 shrink-0 rounded-sm", className)}
      loading="lazy"
      onError={(e) => {
        if (fallback) {
          e.currentTarget.src = fallback
        }
      }}
      style={style}
    />
  )
}
