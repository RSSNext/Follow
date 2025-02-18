import { FeedViewType } from "@follow/constants"
import { Text, View } from "react-native"

import { useUISettingKey } from "@/src/atoms/settings/ui"
import { ImageContextMenu } from "@/src/components/ui/image/ImageContextMenu"
import { PreviewImage } from "@/src/components/ui/image/PreviewImage"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { useEntry } from "@/src/store/entry/hooks"

import { useSelectedView } from "../../screen/atoms"

export function EntryGridItem({ id }: { id: string }) {
  const view = useSelectedView()
  const item = useEntry(id)

  const pictureViewFilterNoImage = useUISettingKey("pictureViewFilterNoImage")
  if (!item) {
    return null
  }
  const photo = item.media?.find((media) => media.type === "photo")
  const video = item.media?.find((media) => media.type === "video")
  const imageUrl = photo?.url || video?.preview_image_url
  if (pictureViewFilterNoImage && !imageUrl && view === FeedViewType.Pictures) {
    return null
  }

  const blurhash = photo?.blurhash || video?.blurhash
  const aspectRatio =
    view === FeedViewType.Pictures && photo?.height && photo.width
      ? photo.width / photo.height
      : 16 / 9

  return (
    <ItemPressable className="m-1 overflow-hidden rounded-md">
      {imageUrl ? (
        <ImageContextMenu imageUrl={imageUrl}>
          <PreviewImage imageUrl={imageUrl} blurhash={blurhash} aspectRatio={aspectRatio} />
        </ImageContextMenu>
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
  )
}
