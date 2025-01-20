import { MasonryFlashList } from "@shopify/flash-list"
import { Link } from "expo-router"
import { Pressable, View } from "react-native"
import { SharedTransition } from "react-native-reanimated"

import { ReAnimatedExpoImage } from "@/src/components/common/AnimatedComponents"
import { ThemedText } from "@/src/components/common/ThemedText"
import { useEntry } from "@/src/store/entry/hooks"

const transition = SharedTransition.duration(300)

export function EntryColumnGrid({
  entryIds,
  onEndReached,
}: {
  entryIds: string[]
  onEndReached?: () => void
}) {
  return (
    <MasonryFlashList
      data={entryIds}
      numColumns={2}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="p-1"
      renderItem={({ item }) => {
        return <RenderEntryItem id={item} />
      }}
      onEndReached={onEndReached}
    />
  )
}
function RenderEntryItem({ id }: { id: string }) {
  const item = useEntry(id)
  if (!item) {
    return null
  }
  const photo = item.media?.find((media) => media.type === "photo")
  const video = item.media?.find((media) => media.type === "video")
  const imageUrl = photo?.url || video?.preview_image_url
  const aspectRatio =
    photo?.height && photo.width
      ? photo.width / photo.height
      : video?.height && video.width
        ? video.width / video.height
        : 16 / 9

  return (
    <View className="m-1 overflow-hidden rounded-md bg-white">
      <Link href={`/entries/${item.id}`} asChild>
        <Pressable>
          {imageUrl ? (
            <ReAnimatedExpoImage
              source={{ uri: imageUrl }}
              style={{
                width: "100%",
                aspectRatio,
              }}
              sharedTransitionTag={`entry-image-${imageUrl}`}
              sharedTransitionStyle={transition}
              allowDownscaling={false}
              recyclingKey={imageUrl}
            />
          ) : (
            <View className="aspect-video w-full items-center justify-center">
              <ThemedText className="text-center">No media available</ThemedText>
            </View>
          )}
        </Pressable>
      </Link>

      <ThemedText className="p-2">{item.title}</ThemedText>
    </View>
  )
}
