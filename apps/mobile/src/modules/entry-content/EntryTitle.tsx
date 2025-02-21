import { useHeaderHeight } from "@react-navigation/elements"
import { useCallback, useContext, useEffect, useState } from "react"
import { Text, View } from "react-native"
import Animated, { useSharedValue, withTiming } from "react-native-reanimated"

import {
  NavigationBlurEffectHeader,
  NavigationContext,
} from "@/src/components/common/SafeNavigationScrollView"
import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { EntryContentContext, useEntryContentContext } from "@/src/modules/entry-content/ctx"
import { EntryContentHeaderRightActions } from "@/src/modules/entry-content/HeaderActions"
import { useEntry } from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"

export const EntryTitle = ({ title, entryId }: { title: string; entryId: string }) => {
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

export const EntrySocialTitle = ({ entryId }: { entryId: string }) => {
  const { scrollY } = useContext(NavigationContext)!

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
  }, [scrollY, titleHeight, headerHeight, opacityAnimatedValue])

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
