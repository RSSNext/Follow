import { PortalProvider } from "@gorhom/portal"
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import type { AVPlaybackStatus } from "expo-av"
import { Video } from "expo-av"
import { Image } from "expo-image"
import { useLocalSearchParams } from "expo-router"
import { atom } from "jotai"
import type { FC } from "react"
import { Fragment, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { Pressable, Text, useWindowDimensions, View } from "react-native"
import PagerView from "react-native-pager-view"
import Animated, { FadeIn, FadeOut, useSharedValue, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import {
  NavigationBlurEffectHeader,
  NavigationContext,
  SafeNavigationScrollView,
} from "@/src/components/common/SafeNavigationScrollView"
import { EntryContentWebView } from "@/src/components/native/webview/EntryContentWebView"
import type { MediaModel } from "@/src/database/schemas/types"
import { openLink } from "@/src/lib/native"
import { EntryContentContext, useEntryContentContext } from "@/src/modules/entry-content/ctx"
import { EntryAISummary } from "@/src/modules/entry-content/EntryAISummary"
import { EntryContentHeaderRightActions } from "@/src/modules/entry-content/HeaderActions"
import { useEntry, usePrefetchEntryContent } from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"

function Media({ media }: { media: MediaModel }) {
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
          <Image
            source={{ uri: imageUrl }}
            placeholder={{ blurhash: media.blurhash }}
            style={{
              width: "100%",
              aspectRatio: media?.height && media.width ? media.width / media.height : 9 / 16,
              display: isVideo ? (status?.isLoaded ? "none" : "flex") : "flex",
            }}
            contentFit="contain"
            placeholderContentFit="contain"
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
  const entry = useEntry(entryId as string)

  const insets = useSafeAreaInsets()
  const ctxValue = useMemo(
    () => ({
      showAISummaryAtom: atom(false),
    }),
    [],
  )

  return (
    <EntryContentContext.Provider value={ctxValue}>
      <PortalProvider>
        <BottomTabBarHeightContext.Provider value={insets.bottom}>
          <SafeNavigationScrollView
            automaticallyAdjustContentInsets={false}
            className="bg-system-background"
          >
            <Pressable onPress={() => entry?.url && openLink(entry.url)} className="relative py-3">
              {({ pressed }) => (
                <>
                  {pressed && (
                    <Animated.View
                      entering={FadeIn}
                      exiting={FadeOut}
                      className={"bg-system-fill absolute inset-x-1 inset-y-0 rounded-xl"}
                    />
                  )}
                  <EntryTitle title={entry?.title || ""} entryId={entryId as string} />
                  <EntryInfo entryId={entryId as string} />
                </>
              )}
            </Pressable>
            <EntryAISummary entryId={entryId as string} />
            {entry && (
              <View className="mt-3">
                <EntryContentWebView entry={entry} />
              </View>
            )}
          </SafeNavigationScrollView>
        </BottomTabBarHeightContext.Provider>
      </PortalProvider>
    </EntryContentContext.Provider>
  )
}

const EntryInfo = ({ entryId }: { entryId: string }) => {
  const entry = useEntry(entryId)

  if (!entry) return null

  const { publishedAt } = entry

  return (
    <View className="mt-3 px-4">
      <FeedInfo feedId={entry.feedId as string} />
      <Text className="text-secondary-label">
        {publishedAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
      </Text>
    </View>
  )
}

const FeedInfo = ({ feedId }: { feedId: string }) => {
  const feed = useFeed(feedId)
  if (!feed) return null
  return (
    <View className="mb-2">
      <Text className="text-secondary-label">{feed.title}</Text>
    </View>
  )
}

const EntryTitle = ({ title, entryId }: { title: string; entryId: string }) => {
  const { scrollY } = useContext(NavigationContext)!

  const [titleHeight, setTitleHeight] = useState(0)

  const opacityAnimatedValue = useSharedValue(0)

  const headerHeight = useHeaderHeight()

  const [isHeaderTitleVisible, setIsHeaderTitleVisible] = useState(true)

  useEffect(() => {
    const id = scrollY.addListener((value) => {
      if (value.value > titleHeight + headerHeight) {
        opacityAnimatedValue.value = withTiming(1, { duration: 100 })
        setIsHeaderTitleVisible(true)
      } else {
        opacityAnimatedValue.value = withTiming(0, { duration: 100 })
        setIsHeaderTitleVisible(false)
      }
    })

    return () => {
      scrollY.removeListener(id)
    }
  }, [scrollY, title, titleHeight, headerHeight, opacityAnimatedValue])

  const ctxValue = useEntryContentContext()
  return (
    <>
      <NavigationBlurEffectHeader
        headerShown
        headerRight={useCallback(
          () => (
            <EntryContentContext.Provider value={ctxValue}>
              <EntryContentHeaderRightActions
                entryId={entryId}
                titleOpacityShareValue={opacityAnimatedValue}
                isHeaderTitleVisible={isHeaderTitleVisible}
              />
            </EntryContentContext.Provider>
          ),
          [ctxValue, entryId, opacityAnimatedValue, isHeaderTitleVisible],
        )}
        headerTitle={() => (
          <Animated.Text
            className={"text-label text-[17px] font-semibold"}
            numberOfLines={1}
            style={{ opacity: opacityAnimatedValue }}
          >
            {title}
          </Animated.Text>
        )}
      />
      <View
        onLayout={() => {
          setTitleHeight(titleHeight)
        }}
      >
        <Text className="text-label px-4 text-4xl font-bold leading-snug">{title}</Text>
      </View>
    </>
  )
}

// eslint-disable-next-line unused-imports/no-unused-vars
const MediaSwipe: FC<{ mediaList: MediaModel[]; id: string }> = ({ mediaList, id }) => {
  const windowWidth = useWindowDimensions().width

  const maxMediaHeight = Math.max(
    ...mediaList
      .filter((media) => media.height && media.width)
      .map((media) => {
        return windowWidth * (media.height! / media.width!)
      }),
  )
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  return (
    <Fragment>
      {mediaList.length > 0 && (
        <View
          style={{
            height: maxMediaHeight > 0 ? maxMediaHeight : "50%",
            maxHeight: "50%",
          }}
        >
          <PagerView
            key={id}
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
    </Fragment>
  )
}
