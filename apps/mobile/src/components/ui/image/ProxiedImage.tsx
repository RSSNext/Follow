import type { ImageProps } from "expo-image"
import { Image } from "expo-image"
import { forwardRef, useMemo } from "react"

const IMAGE_PROXY_URL = "https://webp.follow.is"

const getImageProxyUrl = ({
  url,
  width,
  height,
}: {
  url: string
  width?: number
  height?: number
}) => {
  return `${IMAGE_PROXY_URL}?url=${encodeURIComponent(url)}&width=${width ? Math.floor(width) : ""}&height=${height ? Math.floor(height) : ""}`
}

export const ProxiedImage = forwardRef<
  Image,
  ImageProps & {
    proxy: {
      width?: number
      height?: number
    }
  }
>(({ proxy, source, ...rest }, ref) => {
  const nextSrc = useMemo(() => {
    if (!source) return source

    if (!proxy?.height && !proxy?.width) {
      return source
    }
    if (typeof source === "string") {
      return getImageProxyUrl({
        url: source,
        width: proxy?.width ? proxy?.width * 3 : undefined,
        height: proxy?.height ? proxy?.height * 3 : undefined,
      })
    } else {
      return {
        ...source,
        uri: getImageProxyUrl({
          url: source.uri,
          width: proxy?.width ? proxy?.width * 3 : undefined,
          height: proxy?.height ? proxy?.height * 3 : undefined,
        }),
      }
    }
  }, [source, proxy?.height, proxy?.width])

  return <Image source={nextSrc} {...rest} ref={ref} />
})
