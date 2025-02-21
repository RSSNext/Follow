import { Image } from "expo-image"
import type { FC } from "react"
import { useRef } from "react"
import { Pressable, View } from "react-native"

import { usePreviewImage } from "./PreviewPageProvider"

export interface PreviewImageProps {
  imageUrl: string
  blurhash?: string | undefined
  aspectRatio: number
  Accessory?: FC<any>
  AccessoryProps?: any
  onPreview?: () => void
}

export const PreviewImage = ({
  imageUrl,
  blurhash,
  aspectRatio,
  Accessory,
  AccessoryProps,
  onPreview,
}: PreviewImageProps) => {
  const imageRef = useRef<View>(null)

  const { openPreview } = usePreviewImage()
  return (
    <Pressable
      onPress={() => {
        onPreview?.()
        openPreview({
          imageRef,
          images: [{ imageUrl, aspectRatio, blurhash, recyclingKey: imageUrl }],
          accessoriesElement: Accessory ? <Accessory {...AccessoryProps} /> : undefined,
        })
      }}
    >
      <View ref={imageRef}>
        <Image
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
    </Pressable>
  )
}
