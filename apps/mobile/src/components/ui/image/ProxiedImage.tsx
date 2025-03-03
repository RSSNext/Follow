import { buildSafeHeaders } from "@follow/utils/src/headers"
import { getImageProxyUrl } from "@follow/utils/src/img-proxy"
import type { ImageProps } from "expo-image"
import { Image } from "expo-image"
import { forwardRef, useCallback, useMemo, useState } from "react"

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
      headers: buildSafeHeaders({ url: source }),
    }
  } else {
    nextSource = {
      ...source,
      headers: {
        ...buildSafeHeaders({ url: source.uri }),
        ...source.headers,
      },
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
