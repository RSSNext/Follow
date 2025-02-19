import { FeedViewType } from "@follow/constants"
import { useMemo } from "react"
import { Text, View } from "react-native"

import { useUISettingKey } from "@/src/atoms/settings/ui"
import { ImageContextMenu } from "@/src/components/ui/image/ImageContextMenu"
import { PreviewImage } from "@/src/components/ui/image/PreviewImage"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { useEntry } from "@/src/store/entry/hooks"

import { useSelectedView } from "../../screen/atoms"

export type MasonryItem = {
  id: string
} & (
  | {
      type: "image"
      imageUrl: string
      blurhash?: string
      height?: number
      width?: number
    }
  | {
      type: "video"
      videoUrl: string
      videoPreviewImageUrl?: string
    }
)
export function EntryGridItem(props: MasonryItem) {
  const { type, id } = props
  const view = useSelectedView()
  const item = useEntry(id)

  const pictureViewFilterNoImage = useUISettingKey("pictureViewFilterNoImage")

  const Content = useMemo(() => {
    switch (type) {
      case "image": {
        const { imageUrl, blurhash, height, width } = props
        const aspectRatio = height && width ? width / height : 16 / 9

        return imageUrl ? (
          <ImageContextMenu imageUrl={imageUrl}>
            <PreviewImage imageUrl={imageUrl} blurhash={blurhash} aspectRatio={aspectRatio} />
          </ImageContextMenu>
        ) : (
          <View className="aspect-video w-full items-center justify-center">
            <Text className="text-label text-center">No media available</Text>
          </View>
        )
      }
      case "video": {
        const { videoPreviewImageUrl } = props
        return (
          <>
            {videoPreviewImageUrl ? (
              <ImageContextMenu imageUrl={videoPreviewImageUrl}>
                <PreviewImage imageUrl={videoPreviewImageUrl} aspectRatio={16 / 9} />
              </ImageContextMenu>
            ) : (
              <View className="aspect-video w-full items-center justify-center">
                <Text className="text-label text-center">No media available</Text>
              </View>
            )}
            <Text className="text-label p-2 font-medium" numberOfLines={2}>
              {item?.title}
            </Text>
          </>
        )
      }
    }
  }, [type, JSON.stringify(props), item?.title])
  if (!item) {
    return null
  }

  if (
    pictureViewFilterNoImage &&
    type === "image" &&
    !props.imageUrl &&
    view === FeedViewType.Pictures
  ) {
    return null
  }

  return <ItemPressable className="m-1 overflow-hidden rounded-md">{Content}</ItemPressable>
}
