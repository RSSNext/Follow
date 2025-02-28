import type { ImageProps } from "expo-image"
import { Image } from "expo-image"
import { forwardRef, useCallback, useMemo, useState } from "react"

import { getImageHeaders } from "@/src/lib/image"

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
  let nextSource: ImageProps["source"] = source
  if (typeof source === "string") {
    nextSource = {
      uri: source,
      headers: getImageHeaders(source),
    }
  } else if (!source.headers) {
    nextSource = {
      ...source,
      headers: getImageHeaders(source.uri),
    }
  }

  const finalSource = useMemo(() => {
    if (!proxy?.height && !proxy?.width) {
      return nextSource
    }
    return {
      ...nextSource,
      uri: getImageProxyUrl({
        url: nextSource.uri,
        width: proxy?.width ? proxy?.width * 3 : undefined,
        height: proxy?.height ? proxy?.height * 3 : undefined,
      }),
    }
  }, [proxy?.height, proxy?.width, nextSource])

  const [isError, setIsError] = useState(false)
  const onError = useCallback(() => {
    setIsError(true)
  }, [])

  return <Image source={isError ? nextSource : finalSource} onError={onError} {...rest} ref={ref} />
})
