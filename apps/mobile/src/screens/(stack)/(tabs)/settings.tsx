import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useContext, useEffect } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { ScrollView, useAnimatedValue } from "react-native"
import { withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useEventCallback } from "usehooks-ts"

import { TabBarBackgroundContext } from "@/src/contexts/TabBarBackgroundContext"
import { SettingRoutes } from "@/src/modules/settings/routes"
import { SettingsList } from "@/src/modules/settings/SettingsList"
import { UserHeaderBanner } from "@/src/modules/settings/UserHeaderBanner"

const Stack = createNativeStackNavigator()
export default function SettingsX() {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
      {SettingRoutes(Stack)}
    </Stack.Navigator>
  )
}

function Settings() {
  const insets = useSafeAreaInsets()
  const { opacity } = useContext(TabBarBackgroundContext)
  const tabBarHeight = useBottomTabBarHeight()
  useEffect(() => {
    opacity.value = 1
    return () => {
      opacity.value = 1
    }
  }, [opacity])

  const animatedScrollY = useAnimatedValue(0)
  const handleScroll = useEventCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = nativeEvent

      const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y

      const fadeThreshold = 50

      if (distanceFromBottom <= fadeThreshold) {
        const newOpacity = Math.max(0, distanceFromBottom / fadeThreshold)
        opacity.value = withTiming(newOpacity, { duration: 150 })
      } else {
        opacity.value = withTiming(1, { duration: 150 })
      }
      animatedScrollY.setValue(nativeEvent.contentOffset.y)
    },
  )
  return (
    <ScrollView
      scrollEventThrottle={16}
      onScroll={handleScroll}
      style={{ paddingTop: insets.top }}
      className="bg-system-background flex-1"
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarHeight }}
      scrollIndicatorInsets={{ bottom: tabBarHeight - insets.bottom }}
    >
      <UserHeaderBanner />

      <SettingsList />
    </ScrollView>
  )
}
