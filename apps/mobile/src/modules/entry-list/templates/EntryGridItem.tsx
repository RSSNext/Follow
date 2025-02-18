import { FeedViewType } from "@follow/constants"
import { Image } from "expo-image"
import { useState } from "react"
import { Modal, Pressable, Text, View } from "react-native"
import { useSharedValue } from "react-native-reanimated"

import { ReAnimatedPressable } from "@/src/components/common/AnimatedComponents"
import { PreviewImage } from "@/src/components/ui/image/PreviewImage"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { CloseCuteReIcon } from "@/src/icons/close_cute_re"
import { useEntry } from "@/src/store/entry/hooks"

import { useSelectedView } from "../../screen/atoms"

export function EntryGridItem({ id }: { id: string }) {
  const view = useSelectedView()
  const item = useEntry(id)

  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const scaleValue = useSharedValue(1)
  const transformXValue = useSharedValue(0)
  const transformYValue = useSharedValue(0)

  if (!item) {
    return null
  }
  const photo = item.media?.find((media) => media.type === "photo")
  const video = item.media?.find((media) => media.type === "video")
  const imageUrl = photo?.url || video?.preview_image_url
  const blurhash = photo?.blurhash || video?.blurhash
  const aspectRatio =
    view === FeedViewType.Pictures && photo?.height && photo.width
      ? photo.width / photo.height
      : 16 / 9

  return (
    <>
      <Modal
        transparent
        className="absolute inset-0 flex flex-1 items-center justify-center bg-white/20"
        visible={previewModalOpen}
      >
        <View className="flex-1 items-center justify-center">
          <Pressable
            className="absolute right-2 top-safe-offset-2"
            onPress={() => setPreviewModalOpen(false)}
          >
            <CloseCuteReIcon />
          </Pressable>
          <ReAnimatedPressable
            style={{
              transform: [
                { scale: scaleValue },
                { translateX: transformXValue },
                { translateY: transformYValue },
              ],
            }}
          >
            <Image
              source={{ uri: imageUrl }}
              className="w-full"
              style={{
                aspectRatio,
              }}
              transition={500}
              placeholder={{
                blurhash,
              }}
            />
          </ReAnimatedPressable>
        </View>
      </Modal>
      <ItemPressable className="m-1 overflow-hidden rounded-md">
        {imageUrl ? (
          <PreviewImage imageUrl={imageUrl} blurhash={blurhash} aspectRatio={aspectRatio} />
        ) : (
          <View className="aspect-video w-full items-center justify-center">
            <Text className="text-label text-center">No media available</Text>
          </View>
        )}

        {view === FeedViewType.Videos && (
          <Text className="text-label p-2 font-medium" numberOfLines={2}>
            {item.title}
          </Text>
        )}
      </ItemPressable>
    </>
  )
}
