import { useLocalSearchParams } from "expo-router"
import { useMemo } from "react"
import { Share, TouchableOpacity, useAnimatedValue } from "react-native"
import { useColor } from "react-native-uikit-colors"

import {
  NavigationBlurEffectHeader,
  NavigationContext,
} from "@/src/components/common/SafeNavigationScrollView"
import { Share3CuteReIcon } from "@/src/icons/share_3_cute_re"
import { getWebUrl } from "@/src/lib/env"
import { HomeLeftAction, HomeRightAction } from "@/src/modules/screen/action"
import { headerHideableBottomHeight } from "@/src/modules/screen/hooks/useHeaderHeight"
import { TimelineViewSelector } from "@/src/modules/screen/TimelineViewSelector"
import { getFeed } from "@/src/store/feed/getter"

import { useEntryListContext, useSelectedFeedTitle } from "./atoms"

export function TimelineSelectorHeader({ children }: { children: React.ReactNode }) {
  const scrollY = useAnimatedValue(0)
  const viewTitle = useSelectedFeedTitle()
  const screenType = useEntryListContext().type

  const params = useLocalSearchParams()
  const isFeed = screenType === "feed"
  const isTimeline = screenType === "timeline"
  return (
    <NavigationContext.Provider value={useMemo(() => ({ scrollY }), [scrollY])}>
      <NavigationBlurEffectHeader
        headerBackTitle={isFeed ? "Subscriptions" : undefined}
        headerShown
        title={viewTitle}
        headerLeft={useMemo(
          () => (isTimeline ? () => <HomeLeftAction /> : undefined),
          [isTimeline],
        )}
        headerRight={useMemo(() => {
          if (isTimeline) return () => <HomeRightAction />
          if (isFeed) return () => <FeedShareAction params={params} />
          return
        }, [isTimeline, isFeed, params])}
        headerHideableBottomHeight={isTimeline ? headerHideableBottomHeight : undefined}
        headerHideableBottom={isTimeline ? TimelineViewSelector : undefined}
      />
      {children}
    </NavigationContext.Provider>
  )
}

function FeedShareAction({ params }: { params: any }) {
  const label = useColor("label")
  const { feedId } = params

  if (!feedId) return null
  return (
    <TouchableOpacity
      hitSlop={10}
      onPress={() => {
        const feed = getFeed(feedId)
        if (!feed) return
        const webUrl = getWebUrl()
        const url = `${webUrl}/share/feeds/${feedId}`
        Share.share({
          message: `Check out ${feed.title} on Follow: ${url}`,
          title: feed.title!,
          url,
        })
      }}
    >
      <Share3CuteReIcon height={20} width={20} color={label} />
    </TouchableOpacity>
  )
}
