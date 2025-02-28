import { useTypeScriptHappyCallback } from "@follow/hooks"
import { useHeaderHeight } from "@react-navigation/elements"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useContext, useEffect, useState } from "react"
import { Text, useWindowDimensions, View } from "react-native"
import type { SharedValue } from "react-native-reanimated"
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

import { useUISettingKey } from "@/src/atoms/settings/ui"
import { DefaultHeaderBackButton } from "@/src/components/layouts/header/NavigationHeader"
import { NavigationContext } from "@/src/components/layouts/views/NavigationContext"
import { NavigationBlurEffectHeader } from "@/src/components/layouts/views/SafeNavigationScrollView"
import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { apiClient } from "@/src/lib/api-fetch"
import { EntryContentContext, useEntryContentContext } from "@/src/modules/entry-content/ctx"
import { EntryContentHeaderRightActions } from "@/src/modules/entry-content/EntryContentHeaderRightActions"
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
  const headerBarWidth = useWindowDimensions().width
  return (
    <>
      <NavigationBlurEffectHeader
        headerShown
        headerTitleAbsolute
        title={title}
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
        headerTitle={useCallback(
          () => (
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
          ),
          [headerBarWidth, opacityAnimatedValue, title],
        )}
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
        title="Post"
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
      <DefaultHeaderBackButton canGoBack={canGoBack} />

      {!hideRecentReader && (
        <Animated.View style={animatedOpacity} className="absolute left-[32px] z-10 flex-row gap-2">
          <EntryReadHistory entryId={entryId} />
        </Animated.View>
      )}
    </View>
  )
}

const EntryReadHistory = ({ entryId }: { entryId: string }) => {
  const { data } = useQuery({
    queryKey: ["entry-read-history", entryId],
    queryFn: () => {
      return apiClient.entries["read-histories"][":id"].$get({
        param: {
          id: entryId,
        },
        query: {
          size: 6,
        },
      })
    },
    staleTime: 1000 * 60 * 5,
  })
  if (!data?.data.entryReadHistories) return null
  return (
    <View className="flex-row items-center justify-center">
      {data?.data.entryReadHistories.userIds.map((userId, index) => {
        const user = data.data.users[userId]
        if (!user) return null
        return (
          <View
            className="border-system-background bg-tertiary-system-background overflow-hidden rounded-full border-2"
            key={userId}
            style={{
              transform: [
                {
                  translateX: index * -10,
                },
              ],
            }}
          >
            <UserAvatar size={25} name={user.name!} image={user.image} />
          </View>
        )
      })}
    </View>
  )
}
