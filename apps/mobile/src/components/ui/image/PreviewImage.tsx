import type { FC } from "react"
import { useRef } from "react"
import { Pressable, View } from "react-native"

import { usePreviewImage } from "./PreviewPageProvider"
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
          className="w-full"
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
