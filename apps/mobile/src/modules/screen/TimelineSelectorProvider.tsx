import { env } from "@follow/shared/src/env"
import { useLocalSearchParams } from "expo-router"
import { useMemo } from "react"
import { Share, useAnimatedValue, View } from "react-native"
import { useColor } from "react-native-uikit-colors"

import { DefaultHeaderBackButton } from "@/src/components/layouts/header/NavigationHeader"
import { NavigationContext } from "@/src/components/layouts/views/NavigationContext"
import { NavigationBlurEffectHeader } from "@/src/components/layouts/views/SafeNavigationScrollView"
import { UIBarButton } from "@/src/components/ui/button/UIBarButton"
import { TIMELINE_VIEW_SELECTOR_HEIGHT } from "@/src/constants/ui"
import { Share3CuteReIcon } from "@/src/icons/share_3_cute_re"
import {
  HomeLeftAction,
  HomeSharedRightAction,
  UnreadOnlyActionButton,
} from "@/src/modules/screen/action"
import { TimelineViewSelector } from "@/src/modules/screen/TimelineViewSelector"
import { getFeed } from "@/src/store/feed/getter"

import { useEntryListContext, useSelectedFeedTitle } from "./atoms"

const HEADER_ACTIONS_GROUP_WIDTH = 60
export function TimelineSelectorProvider({ children }: { children: React.ReactNode }) {
  const scrollY = useAnimatedValue(0)
  const viewTitle = useSelectedFeedTitle()
  const screenType = useEntryListContext().type
  const params = useLocalSearchParams()
  const isFeed = screenType === "feed"
  const isTimeline = screenType === "timeline"
  const isSubscriptions = screenType === "subscriptions"
  return (
    <NavigationContext.Provider value={useMemo(() => ({ scrollY }), [scrollY])}>
      <NavigationBlurEffectHeader
        headerShown
        title={viewTitle}
        headerLeft={useMemo(
          () =>
            isTimeline || isSubscriptions
              ? () => (
                  <View style={{ width: HEADER_ACTIONS_GROUP_WIDTH }}>
                    <HomeLeftAction />
                  </View>
                )
              : () => (
                  <View style={{ width: HEADER_ACTIONS_GROUP_WIDTH }}>
                    <DefaultHeaderBackButton canGoBack={true} />
                  </View>
                ),
          [isTimeline, isSubscriptions],
        )}
        headerRight={useMemo(() => {
          const Component = (() => {
            const buttonVariant = isFeed ? "secondary" : "primary"
            if (isTimeline)
              return () => (
                <HomeSharedRightAction>
                  <UnreadOnlyActionButton variant={buttonVariant} />
                </HomeSharedRightAction>
              )
            if (isSubscriptions) return () => <HomeSharedRightAction />
            if (isFeed)
              return () => (
                <View className="-mr-2 flex-row gap-2">
                  <UnreadOnlyActionButton variant={buttonVariant} />
                  <FeedShareAction params={params} />
                </View>
              )
          })()

          if (Component)
            return () => (
              <View
                style={{
                  width: HEADER_ACTIONS_GROUP_WIDTH,
                }}
                className="flex-row items-center justify-end"
              >
                {Component()}
              </View>
            )
          return
        }, [isFeed, isTimeline, isSubscriptions, params])}
        headerHideableBottom={isTimeline || isSubscriptions ? TimelineViewSelector : undefined}
        headerHideableBottomHeight={TIMELINE_VIEW_SELECTOR_HEIGHT}
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
    <UIBarButton
      label="Share"
      normalIcon={<Share3CuteReIcon height={24} width={24} color={label} />}
      onPress={() => {
        const feed = getFeed(feedId)
        if (!feed) return
        const url = `${env.VITE_WEB_URL}/share/feeds/${feedId}`
        Share.share({
          message: `Check out ${feed.title} on Follow: ${url}`,
          title: feed.title!,
          url,
        })
      }}
    />
  )
}
