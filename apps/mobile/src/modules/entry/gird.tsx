import { MasonryFlashList } from "@shopify/flash-list"
import { Link } from "expo-router"
import { Pressable, View } from "react-native"
import { SharedTransition } from "react-native-reanimated"

import { ReAnimatedExpoImage } from "@/src/components/common/AnimatedComponents"
import { ThemedText } from "@/src/components/common/ThemedText"

import { DATA } from "./data"

const transition = SharedTransition.duration(300)

type EntryList = Array<{
  entries: {
    id: string
    title: string
    media: Array<{
      type: string
      url: string
      width?: number
      height?: number
      preview_image_url?: string
    }>
  }
}>

export function EntryColumnGrid() {
  return (
    <View className="flex-1 flex-row bg-gray-50">
      <MasonryFlashList
        data={DATA as EntryList}
        numColumns={2}
        keyExtractor={(item) => item.entries.id}
        contentContainerClassName="p-1"
        renderItem={({ item }) => {
          const photo = item.entries.media.find((media) => media.type === "photo")
          const video = item.entries.media.find((media) => media.type === "video")
          const imageUrl = photo?.url || video?.preview_image_url
          const aspectRatio =
            photo?.height && photo.width
              ? photo.width / photo.height
              : video?.height && video.width
                ? video.width / video.height
                : 16 / 9

          return (
            <View className="m-1 overflow-hidden rounded-md bg-white">
              <Link href={`/entries/${item.entries.id}`} asChild>
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
                    />
                  ) : (
                    <View className="aspect-video w-full items-center justify-center">
                      <ThemedText className="text-center">No media available</ThemedText>
                    </View>
                  )}
                </Pressable>
              </Link>

              <ThemedText className="p-2">{item.entries.title}</ThemedText>
            </View>
          )
        }}
      />
    </View>
  )
}
