import { useTypeScriptHappyCallback } from "@follow/hooks"
import { useCallback, useContext, useState } from "react"
import { Text, useWindowDimensions, View } from "react-native"
import type { SharedValue } from "react-native-reanimated"
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

import { useUISettingKey } from "@/src/atoms/settings/ui"
import { DefaultHeaderBackButton } from "@/src/components/layouts/header/NavigationHeader"
import { NavigationBlurEffectHeader } from "@/src/components/layouts/views/SafeNavigationScrollView"
import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { ScreenItemContext } from "@/src/lib/navigation/ScreenItemContext"
import { EntryContentContext, useEntryContentContext } from "@/src/modules/entry-content/ctx"
import { EntryContentHeaderRightActions } from "@/src/modules/entry-content/EntryContentHeaderRightActions"
import { useEntry } from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"

import { useHeaderHeight } from "../screen/hooks/useHeaderHeight"
import { EntryReadHistory } from "./EntryReadHistory"

export const EntryTitle = ({ title, entryId }: { title: string; entryId: string }) => {
  const reanimatedScrollY = useContext(ScreenItemContext).reAnimatedScrollY
  const [titleHeight, setTitleHeight] = useState(0)

  const opacityAnimatedValue = useSharedValue(0)

  const headerHeight = useHeaderHeight()

  const [isHeaderTitleVisible, setIsHeaderTitleVisible] = useState(true)

  useAnimatedReaction(
    () => reanimatedScrollY.value,
    (value) => {
      if (value > titleHeight + headerHeight) {
        opacityAnimatedValue.value = withTiming(1, { duration: 100 })
        runOnJS(setIsHeaderTitleVisible)(true)
      } else {
        opacityAnimatedValue.value = withTiming(0, { duration: 100 })
        runOnJS(setIsHeaderTitleVisible)(false)
      }
    },
  )

  const ctxValue = useEntryContentContext()
  const headerBarWidth = useWindowDimensions().width
  return (
    <>
      <NavigationBlurEffectHeader
        headerTitleAbsolute
        headerLeft={useTypeScriptHappyCallback(
          ({ canGoBack }) => (
            <EntryLeftGroup
              canGoBack={canGoBack ?? false}
              entryId={entryId}
              titleOpacityShareValue={opacityAnimatedValue}
            />
          ),
          [entryId],
        )}
        headerRight={
          <EntryContentContext.Provider value={ctxValue}>
            <EntryContentHeaderRightActions
              entryId={entryId}
              titleOpacityShareValue={opacityAnimatedValue}
              isHeaderTitleVisible={isHeaderTitleVisible}
            />
          </EntryContentContext.Provider>
        }
        headerTitle={
          <View
            className="flex-row items-center justify-center"
            pointerEvents="none"
            style={{ width: headerBarWidth - 80 }}
          >
            <Animated.Text
              className={"text-label text-center text-[17px] font-semibold"}
              numberOfLines={1}
              style={{ opacity: opacityAnimatedValue }}
            >
              {title}
            </Animated.Text>
          </View>
        }
      />
      <View
        onLayout={() => {
          setTitleHeight(titleHeight)
        }}
      >
        <Text className="text-label px-4 text-4xl font-bold leading-snug">{title.trim()}</Text>
      </View>
    </>
  )
}

export const EntrySocialTitle = ({ entryId }: { entryId: string }) => {
  const reanimatedScrollY = useContext(ScreenItemContext).reAnimatedScrollY

  const opacityAnimatedValue = useSharedValue(0)

  const entry = useEntry(entryId, (entry) => {
    return {
      authorAvatar: entry.authorAvatar,
      author: entry.author,
      feedId: entry.feedId,
    }
  })

  const feed = useFeed(entry?.feedId as string)

  const headerHeight = useHeaderHeight()

  const titleHeight = -60
  const [isHeaderTitleVisible, setIsHeaderTitleVisible] = useState(true)

  useAnimatedReaction(
    () => reanimatedScrollY.value,
    (value) => {
      if (value > titleHeight + headerHeight) {
        opacityAnimatedValue.value = withTiming(1, { duration: 100 })
        runOnJS(setIsHeaderTitleVisible)(true)
      } else {
        opacityAnimatedValue.value = withTiming(0, { duration: 100 })
        runOnJS(setIsHeaderTitleVisible)(false)
      }
    },
  )

  const ctxValue = useEntryContentContext()
  return (
    <>
      <NavigationBlurEffectHeader
        title="Post"
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
            Post
          </Animated.Text>
        )}
      />
      <View className="flex-row items-center gap-3 px-4">
        {entry?.authorAvatar ? (
          <UserAvatar size={28} name={entry?.author || ""} image={entry?.authorAvatar} />
        ) : (
          feed && <FeedIcon feed={feed} size={28} />
        )}
        <Text className="text-label text-[16px] font-semibold">
          {entry?.author || feed?.title || ""}
        </Text>
      </View>
    </>
  )
}

interface EntryLeftGroupProps {
  canGoBack: boolean
  entryId: string
  titleOpacityShareValue: SharedValue<number>
}

const EntryLeftGroup = ({ canGoBack, entryId, titleOpacityShareValue }: EntryLeftGroupProps) => {
  const hideRecentReader = useUISettingKey("hideRecentReader")
  const animatedOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(titleOpacityShareValue.value, [0, 1], [1, 0]),
    }
  })
  return (
    <View className="flex-row items-center justify-center">
      <DefaultHeaderBackButton canGoBack={canGoBack} canDismiss={false} />

      {!hideRecentReader && (
        <Animated.View style={animatedOpacity} className="absolute left-[32px] z-10 flex-row gap-2">
          <EntryReadHistory entryId={entryId} />
        </Animated.View>
      )}
    </View>
  )
}
