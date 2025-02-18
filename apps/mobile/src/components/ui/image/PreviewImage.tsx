import { Image } from "expo-image"
import { useRef } from "react"
import { Pressable, View } from "react-native"

import { usePreviewImage } from "./PreviewPageProvider"

interface PreviewImageProps {
  imageUrl: string
  blurhash?: string | undefined
  aspectRatio: number
}

export const PreviewImage = ({ imageUrl, blurhash, aspectRatio }: PreviewImageProps) => {
  const imageRef = useRef<View>(null)

  const { openPreview } = usePreviewImage()
  return (
    <Pressable
      onPress={() =>
        openPreview({
          imageRef,
          images: [
            { imageUrl, aspectRatio, blurhash, recyclingKey: imageUrl },
            {
              imageUrl:
                "https://raw.githubusercontent.com/RSSNext/assets/refs/heads/main/poster.png",
              aspectRatio,
              blurhash,
            },
          ],
        })
      }
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
