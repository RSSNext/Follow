import { Stack, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { Dimensions, View } from "react-native"
import PagerView from "react-native-pager-view"

import { ReAnimatedExpoImage } from "@/src/components/common/AnimatedComponents"
import { useShouldAnimate } from "@/src/modules/entry/ctx"
import { DATA } from "@/src/modules/entry/data"

export default function EntryDetailPage() {
  const { entryId } = useLocalSearchParams()
  const initialIndex = DATA.findIndex((item) => item.entries.id === entryId)
  const item = DATA[initialIndex]
  const mediaList = item?.entries.media
    .filter((media) => media.type === "photo")
    .filter((media, index) => {
      return item.entries.media.findIndex((m) => m.url === media.url) === index
    })
  const windowWidth = Dimensions.get("window").width
  const maxPhotoHeight = Math.max(
    ...mediaList
      .filter((media) => media.height && media.width)
      .map((media) => {
        return windowWidth * (media.height / media.width)
      }),
  )

  const shouldAnimate = useShouldAnimate()

  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  return (
    <>
      <Stack.Screen options={{ animation: "fade" }} />
      <View className="flex-1 p-safe">
        <View
          style={{
            height: maxPhotoHeight > 0 ? maxPhotoHeight : "80%",
            maxHeight: "80%",
          }}
        >
          {mediaList.length > 0 && (
            <PagerView
              key={item.entries.id}
              style={{ flex: 1 }}
              initialPage={0}
              orientation="horizontal"
              onPageSelected={(event) => {
                setCurrentPageIndex(event.nativeEvent.position)
              }}
            >
              {mediaList.map((media) => {
                return (
                  <View key={media.url} className="bg-gray-6 flex-1 justify-center">
                    <ReAnimatedExpoImage
                      source={{ uri: media?.url }}
                      style={{
                        width: "100%",
                        aspectRatio:
                          media?.height && media.width ? media.width / media.height : 9 / 16,
                      }}
                      sharedTransitionTag={shouldAnimate ? `entry-image-${media?.url}` : undefined}
                      allowDownscaling={false}
                    />
                  </View>
                )
              })}
            </PagerView>
          )}
          <View className="absolute inset-x-0 bottom-1 w-full flex-row items-center justify-center gap-2">
            {Array.from({ length: mediaList.length }).map((_, index) => {
              return (
                <View
                  key={index}
                  className={`size-2 rounded-full ${
                    index === currentPageIndex ? "bg-red" : "bg-gray-2"
                  }`}
                />
              )
            })}
          </View>
        </View>
      </View>
    </>
  )
}
