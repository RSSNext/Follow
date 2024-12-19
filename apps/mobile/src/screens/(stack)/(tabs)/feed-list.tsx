import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { ScrollView, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { bottomViewTabHeight } from "@/src/constants/ui"
import { SubscriptionList } from "@/src/modules/feed-list/list"

import { ViewTab } from "../../../modules/feed-list/ViewTab"

export default function FeedList() {
  const tabHeight = useBottomTabBarHeight()
  const headerHeight = useHeaderHeight()

  const insets = useSafeAreaInsets()
  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        scrollIndicatorInsets={{
          top: bottomViewTabHeight + headerHeight - insets.top,
          bottom: tabHeight - insets.bottom,
          right: 0,
        }}
      >
        <View style={{ height: headerHeight - insets.top + bottomViewTabHeight }} />
        <SubscriptionList />
        <View style={{ height: tabHeight }} />
      </ScrollView>
      <ViewTab />
    </>
  )
}
