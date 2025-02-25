import { FeedViewType } from "@follow/constants"
import { useLocalSearchParams } from "expo-router"
import { useMemo } from "react"
import { Share, useAnimatedValue, View } from "react-native"
import { useColor } from "react-native-uikit-colors"

import {
  NavigationBlurEffectHeader,
  NavigationContext,
} from "@/src/components/common/SafeNavigationScrollView"
import { UIBarButton } from "@/src/components/ui/button/UIBarButton"
import { Share3CuteReIcon } from "@/src/icons/share_3_cute_re"
import { getWebUrl } from "@/src/lib/env"
import {
  HideNoMediaActionButton,
  HomeLeftAction,
  HomeSharedRightAction,
  UnreadOnlyActionButton,
} from "@/src/modules/screen/action"
import { TimelineViewSelector } from "@/src/modules/screen/TimelineViewSelector"
import { getFeed } from "@/src/store/feed/getter"

import { useEntryListContext, useSelectedFeedTitle, useSelectedView } from "./atoms"

export function TimelineSelectorProvider({ children }: { children: React.ReactNode }) {
  const scrollY = useAnimatedValue(0)
  const viewTitle = useSelectedFeedTitle()
  const screenType = useEntryListContext().type
  const view = useSelectedView()
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
          () => (isTimeline || isSubscriptions ? () => <HomeLeftAction /> : undefined),
          [isTimeline, isSubscriptions],
        )}
        headerRight={useMemo(() => {
          const buttonVariant = isFeed ? "secondary" : "primary"
          const extraActions = (
            <>
              {view === FeedViewType.Pictures && (
                <HideNoMediaActionButton variant={buttonVariant} />
              )}
            </>
          )
          if (isTimeline)
            return () => (
              <HomeSharedRightAction>
                <UnreadOnlyActionButton variant={buttonVariant} />
                {extraActions}
              </HomeSharedRightAction>
            )
          if (isSubscriptions)
            return () => <HomeSharedRightAction>{extraActions}</HomeSharedRightAction>
          if (isFeed)
            return () => (
              <View className="-mr-2 flex-row gap-2">
                {extraActions}
                <UnreadOnlyActionButton variant={buttonVariant} />
                <FeedShareAction params={params} />
              </View>
            )
          return
        }, [isFeed, view, isTimeline, isSubscriptions, params])}
        headerHideableBottom={isTimeline || isSubscriptions ? TimelineViewSelector : undefined}
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
      normalIcon={<Share3CuteReIcon height={20} width={20} color={label} />}
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
    />
  )
}
