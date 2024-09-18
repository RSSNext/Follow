import { useEffect, useMemo, useState } from "react"

import { getColorScheme, stringToHue } from "~/lib/color"
import { getImageProxyUrl } from "~/lib/img-proxy"
import { cn, getUrlIcon } from "~/lib/utils"

import { PlatformIcon } from "./ui/platform-icon"
/**
 *
 * @deprecated please use `FeedIcon` instead
 * @returns
 */
export function SiteIcon({
  url,
  className,
  style,
  fallback,
  fallbackText,
  proxy,
  src,
}: {
  url?: string
  className?: string
  style?: React.CSSProperties
  /**
   * Fallback image when the site icon is not available
   */
  fallback?: boolean
  fallbackText?: string

  src?: string
  proxy?: {
    width: number
    height: number
  }
}) {
  const colors = useMemo(() => {
    const id = src || url
    return id && fallback ? getColorScheme(stringToHue(id), true) : null
  }, [fallback, src, url])

  const [showFallback, setShowFallback] = useState(false)
  useEffect(() => {
    setShowFallback(false)
  }, [url])

  const stableProxy = useState(proxy)[0]

  const [nextSrc, fallbackUrl] = useMemo((): [string, string] => {
    // src ? getProxyUrl(src) : "";
    if (src) {
      if (stableProxy) {
        return [
          getImageProxyUrl({
            url: src,
            width: stableProxy.width,
            height: stableProxy.height,
          }),
          "",
        ]
      }

      return [src, ""]
    }
    if (!url) return ["", ""]
    const ret = getUrlIcon(url, fallback)

    return [ret.src, ret.fallbackUrl]
  }, [fallback, stableProxy, src, url])

  if (!nextSrc) return null

  return (
    <PlatformIcon
      url={nextSrc}
      style={style}
      className={cn("relative mr-2 size-5 shrink-0 rounded-sm", className)}
    >
      {showFallback && fallback ? (
        <div
          data-error-image={nextSrc || fallbackUrl}
          className="center absolute inset-0 bg-[var(--fo-light-background)] text-[9px] text-white dark:bg-[var(--fo-dark-background)]"
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
          src={nextSrc}
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
