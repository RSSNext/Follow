import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useIsFocused } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createContext, useCallback, useContext, useEffect, useRef } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native"
import { findNodeHandle, UIManager } from "react-native"
import { useSharedValue, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useEventCallback } from "usehooks-ts"

import { ReAnimatedScrollView } from "@/src/components/common/AnimatedComponents"
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
          calculateOpacity(contentSizeRef.current.height, height, 0)
        })
      }
    }
  }, [opacity, isFocused, calculateOpacity])

  const animatedScrollY = useSharedValue(0)
  const handleScroll = useEventCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = nativeEvent
      calculateOpacity(contentSize.height, layoutMeasurement.height, contentOffset.y)
      animatedScrollY.value = contentOffset.y
    },
  )

  const scrollRef = useRef<ScrollView>(null)

  const contentSizeRef = useRef({ height: 0, width: 0 })

  return (
    <ReAnimatedScrollView
      scrollEventThrottle={16}
      onScroll={handleScroll}
      ref={scrollRef}
      onContentSizeChange={(w, h) => {
        contentSizeRef.current = { height: h, width: w }
      }}
      style={{ paddingTop: insets.top }}
      className="bg-system-grouped-background flex-1"
      scrollIndicatorInsets={{ bottom: tabBarHeight - insets.bottom }}
    >
      <UserHeaderBanner scrollY={animatedScrollY} />

      <SettingsList />
    </ReAnimatedScrollView>
  )
}
