import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useIsFocused } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createContext, useCallback, useContext, useEffect, useRef } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { findNodeHandle, ScrollView, UIManager, useAnimatedValue } from "react-native"
import { withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useEventCallback } from "usehooks-ts"

import { BottomTabBarBackgroundContext } from "@/src/contexts/BottomTabBarBackgroundContext"
import { SettingRoutes } from "@/src/modules/settings/routes"
import { SettingsList } from "@/src/modules/settings/SettingsList"
import { UserHeaderBanner } from "@/src/modules/settings/UserHeaderBanner"

const Stack = createNativeStackNavigator()
const OutIsFocused = createContext(false)
export default function SettingsX() {
  const isFocused = useIsFocused()

  return (
    <OutIsFocused.Provider value={isFocused}>
      <Stack.Navigator initialRouteName="Settings">
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        {SettingRoutes(Stack)}
      </Stack.Navigator>
    </OutIsFocused.Provider>
  )
}

function Settings() {
  const insets = useSafeAreaInsets()
  const isFocused = useContext(OutIsFocused)
  const { opacity } = useContext(BottomTabBarBackgroundContext)
  const tabBarHeight = useBottomTabBarHeight()

  const calculateOpacity = useCallback(
    (contentHeight: number, viewportHeight: number, scrollY: number) => {
      const distanceFromBottom = contentHeight - viewportHeight - scrollY
      const fadeThreshold = 50

      if (distanceFromBottom <= fadeThreshold) {
        const newOpacity = Math.max(0, distanceFromBottom / fadeThreshold)
        opacity.value = withTiming(newOpacity, { duration: 150 })
      } else {
        opacity.value = withTiming(1, { duration: 150 })
      }
    },
    [opacity],
  )

  useEffect(() => {
    if (!isFocused) return
    const scrollView = scrollRef.current
    if (scrollView) {
      const node = findNodeHandle(scrollView)
      if (node) {
        UIManager.measure(node, (x, y, width, height) => {
          calculateOpacity(height, height, 0)
        })
      }
    }
  }, [opacity, isFocused, calculateOpacity])

  const animatedScrollY = useAnimatedValue(0)
  const handleScroll = useEventCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = nativeEvent
      calculateOpacity(contentSize.height, layoutMeasurement.height, contentOffset.y)
      animatedScrollY.setValue(contentOffset.y)
    },
  )

  const scrollRef = useRef<ScrollView>(null)
  return (
    <ScrollView
      scrollEventThrottle={16}
      onScroll={handleScroll}
      ref={scrollRef}
      style={{ paddingTop: insets.top }}
      className="bg-system-background flex-1"
      contentContainerStyle={{ paddingBottom: insets.bottom + tabBarHeight }}
      scrollIndicatorInsets={{ bottom: tabBarHeight - insets.bottom }}
    >
      <UserHeaderBanner scrollY={animatedScrollY} />

      <SettingsList />
    </ScrollView>
  )
}
