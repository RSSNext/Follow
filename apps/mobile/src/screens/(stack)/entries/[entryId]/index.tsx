import type { AVPlaybackStatus } from "expo-av"
import { Video } from "expo-av"
import { Stack, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { Dimensions, ScrollView, Text, View } from "react-native"
import PagerView from "react-native-pager-view"

import { ReAnimatedExpoImage } from "@/src/components/common/AnimatedComponents"
import { BlurEffect } from "@/src/components/common/BlurEffect"
import HtmlWeb from "@/src/components/ui/typography/HtmlWeb"
import { useEntry, usePrefetchEntryContent } from "@/src/store/entry/hooks"

function Media({ media }: { media: any }) {
  const isVideo = media.type === "video"
  const imageUrl = isVideo ? media.preview_image_url : media.url
  const videoUrl = media.url

  const [status, setStatus] = useState<AVPlaybackStatus | null>(null)
  if (!imageUrl && !videoUrl) {
    return null
  }

  return (
    <>
      {isVideo && (
        <Video
          source={{ uri: media.url }}
          style={{
            width: "100%",
            aspectRatio: media.width && media.height ? media.width / media.height : 1,
            display: status?.isLoaded ? "flex" : "none",
          }}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      )}
      <View className="flex-1 justify-center">
        {imageUrl ? (
          <ReAnimatedExpoImage
            source={{ uri: imageUrl }}
            style={{
              width: "100%",
              aspectRatio: media?.height && media.width ? media.width / media.height : 9 / 16,
              display: isVideo ? (status?.isLoaded ? "none" : "flex") : "flex",
            }}
            sharedTransitionTag={imageUrl ? `entry-image-${imageUrl}` : undefined}
            allowDownscaling={false}
          />
        ) : (
          <Text className="text-gray-4 text-center">No media</Text>
        )}
      </View>
    </>
  )
}

export default function EntryDetailPage() {
  const { entryId } = useLocalSearchParams()
  usePrefetchEntryContent(entryId as string)
  const item = useEntry(entryId as string)

  const mediaList =
    item?.media
      ?.filter((media) => media.url)
      .filter((media, index) => {
        return item.media?.findIndex((m) => m.url === media.url) === index
      }) || []

  const windowWidth = Dimensions.get("window").width
  const maxMediaHeight = Math.max(
    ...mediaList
      .filter((media) => media.height && media.width)
      .map((media) => {
        return windowWidth * (media.height! / media.width!)
      }),
  )

  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [height, setHeight] = useState(0)

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackTitle: "Feeds",
          headerBackground: BlurEffect,
          headerTransparent: true,
          headerTitle: item?.title ?? "Entry",
        }}
      />
      <ScrollView
        className="pt-safe"
        contentContainerClassName="flex-grow"
        contentInsetAdjustmentBehavior="automatic"
      >
        {mediaList.length > 0 && (
          <View
            style={{
              height: maxMediaHeight > 0 ? maxMediaHeight : "80%",
              maxHeight: "80%",
            }}
          >
            <PagerView
              key={item?.id}
              style={{ flex: 1 }}
              initialPage={0}
              orientation="horizontal"
              onPageSelected={(event) => {
                setCurrentPageIndex(event.nativeEvent.position)
              }}
            >
              {mediaList.map((media) => {
                return <Media key={media.url} media={media} />
              })}
            </PagerView>

            {mediaList.length > 1 && (
              <View className="my-2 w-full flex-row items-center justify-center gap-2">
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
            )}
          </View>
        )}
        <HtmlWeb
          content={item?.content || ""}
          onLayout={async (size) => {
            if (size[1] !== height) {
              setHeight(size[1])
            }
          }}
          dom={{
            scrollEnabled: false,
            style: { height },
          }}
        />
      </ScrollView>
    </>
  )
}
