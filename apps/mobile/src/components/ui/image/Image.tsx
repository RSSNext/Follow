import { createBuildSafeHeaders } from "@follow/utils/src/headers"
import { getImageProxyUrl, IMAGE_PROXY_URL } from "@follow/utils/src/img-proxy"
import type { ImageProps as ExpoImageProps } from "expo-image"
import { Image as ExpoImage } from "expo-image"
import { forwardRef, useCallback, useMemo, useRef, useState } from "react"
import { Pressable, View } from "react-native"

import { proxyEnv } from "@/src/lib/proxy-env"

import { usePreviewImage } from "./PreviewPageProvider"

const buildSafeHeaders = createBuildSafeHeaders(proxyEnv.VITE_WEB_URL, [
  IMAGE_PROXY_URL,
  proxyEnv.VITE_API_URL,
])

export type ImageProps = Omit<ExpoImageProps, "source"> & {
  proxy?: {
    width?: number
    height?: number
  }
  enablePreview?: boolean
  onPreview?: () => void
  source?: {
    uri: string
    headers?: Record<string, string>
  }
  blurhash?: string
  aspectRatio: number
}

export const Image = forwardRef<ExpoImage, ImageProps>(
  ({ proxy, source, enablePreview, onPreview, blurhash, aspectRatio, ...rest }, ref) => {
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
    const onError = useCallback(() => {
      setIsError(true)
    }, [])

    const Wrapper = enablePreview ? Pressable : View

    const { openPreview } = usePreviewImage()
    const imageRef = useRef<View>(null)

    return (
      <Wrapper
        onPress={() => {
          if (enablePreview) {
            onPreview?.()
            openPreview({
              imageRef,
              images: [{ source, blurhash, aspectRatio, ...rest }],
              // accessoriesElement: Accessory ? <Accessory {...AccessoryProps} /> : undefined,
            })
          }
        }}
      >
        <View ref={imageRef}>
          <ExpoImage
            source={isError ? safeSource : proxiesSafeSource}
            onError={onError}
            placeholder={{ blurhash }}
            style={{
              aspectRatio,
              ...(typeof rest.style === "object" && { ...rest.style }),
            }}
            {...rest}
            ref={ref}
          />
        </View>
      </Wrapper>
    )
  },
)
