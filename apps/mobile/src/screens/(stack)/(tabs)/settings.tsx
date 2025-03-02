import { getDefaultHeaderHeight } from "@react-navigation/elements"
import { useIsFocused } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native"
import { findNodeHandle, Text, UIManager } from "react-native"
import type { SharedValue } from "react-native-reanimated"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"
import { useEventCallback } from "usehooks-ts"

import { ReAnimatedScrollView } from "@/src/components/common/AnimatedComponents"
import { BlurEffect } from "@/src/components/common/BlurEffect"
import { BottomTabBarBackgroundContext } from "@/src/components/layouts/tabbar/contexts/BottomTabBarBackgroundContext"
import { SetBottomTabBarVisibleContext } from "@/src/components/layouts/tabbar/contexts/BottomTabBarVisibleContext"
import {
  useBottomTabBarHeight,
  useRegisterNavigationScrollView,
} from "@/src/components/layouts/tabbar/hooks"
import { SettingRoutes } from "@/src/modules/settings/routes"
import { SettingsList } from "@/src/modules/settings/SettingsList"
import { UserHeaderBanner } from "@/src/modules/settings/UserHeaderBanner"

const Stack = createNativeStackNavigator()
const OutIsFocused = createContext(false)
export default function SettingsX() {
  const isFocused = useIsFocused()

  const setTabBarVisible = useContext(SetBottomTabBarVisibleContext)
  return (
    <OutIsFocused.Provider value={isFocused}>
      <Stack.Navigator
        initialRouteName="Settings"
        screenListeners={{
          state: ({ data: { state } }) => {
            if (state.index !== 0) {
              setTabBarVisible(false)
            } else {
              setTabBarVisible(true)
            }
          },
        }}
      >
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
      const fadeThreshold = 20

      if (distanceFromBottom <= fadeThreshold) {
        const newOpacity = Math.max(0, distanceFromBottom / fadeThreshold)
        opacity.value = withTiming(newOpacity, { duration: 50 })
      } else {
        opacity.value = withTiming(1, { duration: 50 })
      }
    },
    [opacity],
  )
  const [contentSize, setContentSize] = useState({ height: 0, width: 0 })
  const registerNavigationScrollView = useRegisterNavigationScrollView<ScrollView>()
  useEffect(() => {
    if (!isFocused) return
    const scrollView = registerNavigationScrollView.current

    if (contentSize.height === 0) return

    if (scrollView) {
      const node = findNodeHandle(scrollView)
      if (node) {
        UIManager.measure(node, (x, y, width, height) => {
          calculateOpacity(contentSize.height, height, 0)
        })
      }
    }
  }, [opacity, isFocused, calculateOpacity, contentSize.height, registerNavigationScrollView])

  const animatedScrollY = useSharedValue(0)
  const handleScroll = useEventCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = nativeEvent
      calculateOpacity(contentSize.height, layoutMeasurement.height, contentOffset.y)
      animatedScrollY.value = contentOffset.y
    },
  )

  return (
    <>
      <ReAnimatedScrollView
        scrollEventThrottle={16}
        onScroll={handleScroll}
        ref={registerNavigationScrollView}
        onContentSizeChange={(w, h) => {
          setContentSize({ height: h, width: w })
        }}
        style={{ paddingTop: insets.top }}
        className="bg-system-grouped-background flex-1"
        scrollIndicatorInsets={{ bottom: tabBarHeight - insets.bottom }}
      >
        <UserHeaderBanner scrollY={animatedScrollY} />

        <SettingsList scrollRef={registerNavigationScrollView} />
      </ReAnimatedScrollView>
      <SettingHeader scrollY={animatedScrollY} />
    </>
  )
}
const SettingHeader = ({ scrollY }: { scrollY: SharedValue<number> }) => {
  const frame = useSafeAreaFrame()
  const insets = useSafeAreaInsets()
  const headerHeight = getDefaultHeaderHeight(frame, false, insets.top)
  const styles = useAnimatedStyle(() => {
    return {
      opacity: scrollY.value / 100,
      height: headerHeight,
      paddingTop: insets.top,
    }
  })

  return (
    <Animated.View
      pointerEvents="none"
      className="border-b-hairline border-opaque-separator pt-safe absolute inset-x-0 top-0 flex-row items-center px-4 pb-2"
      style={styles}
    >
      <BlurEffect />

      <Text className="text-label flex-1 text-center text-[17px] font-semibold">Settings</Text>
    </Animated.View>
  )
}
