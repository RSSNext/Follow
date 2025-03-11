import { createBuildSafeHeaders } from "@follow/utils/src/headers"
import { getImageProxyUrl, IMAGE_PROXY_URL } from "@follow/utils/src/img-proxy"
import type { ImageErrorEventData, ImageProps as ExpoImageProps } from "expo-image"
import { Image as ExpoImage } from "expo-image"
import { forwardRef, useCallback, useMemo, useState } from "react"

import { proxyEnv } from "@/src/lib/proxy-env"

const buildSafeHeaders = createBuildSafeHeaders(proxyEnv.VITE_WEB_URL, [
  IMAGE_PROXY_URL,
  proxyEnv.VITE_API_URL,
])

export type ImageProps = Omit<ExpoImageProps, "source"> & {
  proxy?: {
    width?: number
    height?: number
  }
  source?: {
    uri: string
    headers?: Record<string, string>
  }
  blurhash?: string
  aspectRatio?: number
}

export const Image = forwardRef<ExpoImage, ImageProps>(
  ({ proxy, source, blurhash, aspectRatio, ...rest }, ref) => {
    const safeSource: ImageProps["source"] = useMemo(() => {
      return source
        ? {
            ...source,
            headers: {
              ...buildSafeHeaders({ url: source.uri }),
              ...source.headers,
            },
          }
        : undefined
    }, [source])

    const proxiesSafeSource = useMemo(() => {
      if (!proxy?.height && !proxy?.width) {
        return safeSource
      }
      return safeSource
        ? {
            ...safeSource,
            uri: getImageProxyUrl({
              url: safeSource.uri,
              width: proxy?.width ? proxy?.width * 3 : undefined,
              height: proxy?.height ? proxy?.height * 3 : undefined,
            }),
          }
        : undefined
    }, [proxy?.height, proxy?.width, safeSource])

    const [isError, setIsError] = useState(false)
    const onError = useCallback(
      (e: ImageErrorEventData) => {
        if (isError) {
          rest.onError?.(e)
        } else {
          setIsError(true)
        }
      },
      [isError, rest],
    )

    return (
      <ExpoImage
        source={isError ? safeSource : proxiesSafeSource}
        onError={onError}
        placeholder={{
          blurhash,
          ...(typeof rest.placeholder === "object" && { ...rest.placeholder }),
        }}
        style={{
          aspectRatio,
          ...(typeof rest.style === "object" && { ...rest.style }),
        }}
        {...rest}
        ref={ref}
      />
    )
  },
)
