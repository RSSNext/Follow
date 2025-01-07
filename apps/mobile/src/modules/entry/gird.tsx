import { MasonryFlashList } from "@shopify/flash-list"
import { Link } from "expo-router"
import { Pressable, View } from "react-native"
import { SharedTransition } from "react-native-reanimated"

import { ReAnimatedExpoImage } from "@/src/components/common/AnimatedComponents"
import { ThemedText } from "@/src/components/common/ThemedText"

import { DATA } from "./data"

const transition = SharedTransition.duration(300)

export function EntryColumnGrid() {
  return (
    <View className="flex-1 flex-row bg-gray-50">
      <MasonryFlashList
        data={DATA}
        numColumns={2}
        keyExtractor={(item) => item.entries.id}
        contentContainerClassName="p-1"
        renderItem={({ item }) => {
          const media = item.entries.media.find((media) => media.type === "photo")
          return (
            <View className="m-1 overflow-hidden rounded-md bg-white">
              <Link href={`/entries/${item.entries.id}`} asChild>
                <Pressable>
                  <ReAnimatedExpoImage
                    source={{ uri: media?.url }}
                    style={{
                      width: "100%",
                      aspectRatio:
                        media?.height && media.width ? media.width / media.height : 9 / 16,
                    }}
                    sharedTransitionTag={`entry-image-${media?.url}`}
                    sharedTransitionStyle={transition}
                    allowDownscaling={false}
                  />
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
