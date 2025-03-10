import { cn } from "@follow/utils"
import type { FC } from "react"
import { useRef } from "react"
import { Pressable, View } from "react-native"

import { usePreviewImage } from "./usePreviewImage"
import { ProxiedImage } from "./ProxiedImage"

export interface PreviewImageProps {
  imageUrl: string
  blurhash?: string | undefined
  aspectRatio: number
  Accessory?: FC<any>
  AccessoryProps?: any
  onPreview?: () => void
  proxy?: {
    width?: number
    height?: number
  }
  noPreview?: boolean
  className?: string
}

export const PreviewImage = ({
  imageUrl,
  blurhash,
  aspectRatio,
  Accessory,
  AccessoryProps,
  onPreview,
  proxy,
  noPreview,
  className,
}: PreviewImageProps) => {
  const imageRef = useRef<View>(null)

  const { openPreview } = usePreviewImage()

  const Wrapper = noPreview ? View : Pressable

  return (
    <Wrapper
      onPress={() => {
        if (noPreview) return

        onPreview?.()
        openPreview({
          imageRef,
          images: [{ imageUrl, aspectRatio, blurhash, recyclingKey: imageUrl }],
          accessoriesElement: Accessory ? <Accessory {...AccessoryProps} /> : undefined,
        })
      }}
    >
      <View ref={imageRef}>
        <ProxiedImage
          proxy={{
            width: proxy?.width,
            height: proxy?.height,
          }}
          transition={500}
          source={{ uri: imageUrl }}
          placeholder={{
            blurhash,
          }}
          className={cn("w-full", className)}
          style={{
            aspectRatio,
          }}
          placeholderContentFit="cover"
          recyclingKey={imageUrl}
        />
      </View>
    </Wrapper>
  )
}
