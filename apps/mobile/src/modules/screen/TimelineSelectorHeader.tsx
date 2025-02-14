import { useMemo } from "react"
import { useAnimatedValue } from "react-native"

import {
  NavigationBlurEffectHeader,
  NavigationContext,
} from "@/src/components/common/SafeNavigationScrollView"
import { HomeLeftAction, HomeRightAction } from "@/src/modules/screen/action"
import { useEntryListContext, useSelectedFeedTitle } from "@/src/modules/screen/atoms"
import { headerHideableBottomHeight } from "@/src/modules/screen/hooks/useHeaderHeight"
import { TimelineViewSelector } from "@/src/modules/screen/TimelineViewSelector"

export function TimelineSelectorHeader({ children }: { children: React.ReactNode }) {
  const scrollY = useAnimatedValue(0)
  const viewTitle = useSelectedFeedTitle()
  const screenType = useEntryListContext().type

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
        headerRight={useMemo(
          () => (isTimeline ? () => <HomeRightAction /> : undefined),
          [isTimeline],
        )}
        headerHideableBottomHeight={isTimeline ? headerHideableBottomHeight : undefined}
        headerHideableBottom={isTimeline ? TimelineViewSelector : undefined}
      />
      {children}
    </NavigationContext.Provider>
  )
}
