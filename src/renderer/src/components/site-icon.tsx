import { cn } from "@renderer/lib/utils"
import { parse } from "tldts"

export function SiteIcon({
  url,
  className,
}: {
  url: string
  className?: string
}) {
  let host
  let src
  let fallback

  try {
    host = new URL(url).host
    const pureDomain = parse(host).domainWithoutSuffix
    fallback = `https://avatar.vercel.sh/${pureDomain}.svg?text=${pureDomain?.slice(0, 2).toUpperCase()}`
    src = `https://icon.horse/icon/${host}`
  } catch (error) {
    const pureDomain = parse(url).domainWithoutSuffix
    src = `https://avatar.vercel.sh/${pureDomain}.svg?text=${pureDomain?.slice(0, 2).toUpperCase()}`
  }

  return (
    <img
      src={src}
      className={cn("w-5 h-5 mr-2 rounded-sm shrink-0", className)}
      loading="lazy"
      onError={(e) => {
        if (fallback) {
          e.currentTarget.src = fallback
        }
      }}
    />
  )
}
