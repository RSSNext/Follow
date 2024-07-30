import { getColorScheme, stringToHue } from "@renderer/lib/color"
import { cn } from "@renderer/lib/utils"
import { useEffect, useMemo, useState } from "react"
import { parse } from "tldts"

import { PlatformIcon } from "./ui/platform-icon"

export function SiteIcon({
  url,
  className,
  style,
  fallback,
  fallbackText,
}: {
  url?: string
  className?: string
  style?: React.CSSProperties
  /**
   * Fallback image when the site icon is not available
   */
  fallback?: boolean
  fallbackText?: string
}) {
  let host: string
  let src: string
  let fallbackUrl = ""

  const colors = useMemo(
    () => (url && fallback ? getColorScheme(stringToHue(url), true) : null),
    [fallback, url],
  )

  const [showFallback, setShowFallback] = useState(false)
  useEffect(() => {
    showFallback && fallback && setShowFallback(false)
  }, [fallback, showFallback, url])

  if (!url) return null

  try {
    host = new URL(url).host
    const pureDomain = parse(host).domainWithoutSuffix
    fallbackUrl = `https://avatar.vercel.sh/${pureDomain}.svg?text=${pureDomain
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
      className={cn("relative mr-2 size-5 shrink-0 rounded-sm", className)}
    >
      {showFallback && fallback ? (
        <div
          data-error-image={src || fallbackUrl}
          className="center absolute inset-0 bg-[var(--fo-light-background)] text-[9px] text-white dark:bg-[var(--fo-dark-background)] dark:text-black"
          style={
            {
              "--fo-light-background": colors.light.background,
              "--fo-dark-background": colors.dark.background,
            } as any
          }
        >
          {!!fallbackText && fallbackText[0]}
        </div>
      ) : (
        <img
          src={src}
          loading="lazy"
          onError={(e) => {
            if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
              e.currentTarget.src = fallbackUrl
            } else if (fallback) {
              setShowFallback(true)
            } else {
              // Empty svg
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3C/svg%3E"
            }
          }}
        />
      )}
    </PlatformIcon>
  )
}
