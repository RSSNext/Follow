import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import type { FC } from "react"
import type { ScrollViewProps } from "react-native"
import { ScrollView, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const SafeNavigationScrollView: FC<ScrollViewProps> = ({ children, ...props }) => {
  const headerHeight = useHeaderHeight()
  const tabBarHeight = useBottomTabBarHeight()
  const insets = useSafeAreaInsets()

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" {...props}>
      <View style={{ height: headerHeight - insets.top }} />
      <View>{children}</View>
      <View style={{ height: tabBarHeight - insets.bottom }} />
    </ScrollView>
  )
}
