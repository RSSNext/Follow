import { FeedViewType } from "@follow/constants"
import { PlatformPressable } from "@react-navigation/elements/src/PlatformPressable"
import { router, Tabs } from "expo-router"
import { useContext, useEffect, useMemo, useState } from "react"
import { Animated as RNAnimated, Easing, StyleSheet, useAnimatedValue, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated"

import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"
import { FollowIcon } from "@/src/components/ui/logo"
import { BottomTabBarBackgroundContext } from "@/src/contexts/BottomTabBarBackgroundContext"
import { SetBottomTabBarVisibleContext } from "@/src/contexts/BottomTabBarVisibleContext"
import { SafariCuteFi } from "@/src/icons/safari_cute_fi"
import { SafariCuteIcon } from "@/src/icons/safari_cute-re"
import { Setting7CuteFi } from "@/src/icons/setting_7_cute_fi"
import { Settings7CuteReIcon } from "@/src/icons/settings_7_cute_re"
import { FeedDrawer } from "@/src/modules/feed-drawer/drawer"
import { setCurrentView } from "@/src/modules/subscription/atoms"
import { useColor } from "@/src/theme/colors"

const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onStart(() => {
    runOnJS(setCurrentView)(FeedViewType.Articles)
  })

const fifthTap = Gesture.Tap()
  .numberOfTaps(5)
  .onStart(() => {
    runOnJS(router.push)("/debug")
  })

export default function TabLayout() {
  const opacity = useSharedValue(1)
  const animatedTransformY = useAnimatedValue(1)

  const [tabBarVisible, setTabBarVisible] = useState(true)
  useEffect(() => {
    RNAnimated.timing(animatedTransformY, {
      toValue: tabBarVisible ? 1 : 0,
      useNativeDriver: true,
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    }).start()
  }, [animatedTransformY, tabBarVisible])

  return (
    <FeedDrawer>
      <BottomTabBarBackgroundContext.Provider value={useMemo(() => ({ opacity }), [opacity])}>
        <SetBottomTabBarVisibleContext.Provider value={setTabBarVisible}>
          <Tabs
            screenListeners={{
              tabPress: () => {
                opacity.value = 1
              },
              transitionStart: () => {
                opacity.value = 1
              },
            }}
            screenOptions={{
              tabBarBackground: TabBarBackground,
              tabBarStyle: {
                position: "absolute",
                borderTopWidth: 0,
                transform: [
                  {
                    translateY: animatedTransformY.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    }),
                  },
                ],
              },
              animation: "fade",
              transitionSpec: {
                animation: "timing",
                config: {
                  duration: 50,
                  easing: Easing.ease,
                },
              },
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Subscriptions",
                headerShown: false,
                tabBarIcon: ({ color }) => (
                  <FollowIcon color={color} style={{ width: 20, height: 20 }} />
                ),
                tabBarButton(props) {
                  return (
                    <GestureDetector gesture={doubleTap}>
                      <View className="flex-1">
                        <PlatformPressable {...props} />
                      </View>
                    </GestureDetector>
                  )
                },
              }}
            />
            <Tabs.Screen
              name="discover"
              options={{
                title: "Discover",
                headerShown: false,
                tabBarIcon: ({ color, focused }) => {
                  const Icon = !focused ? SafariCuteIcon : SafariCuteFi
                  return <Icon color={color} width={24} height={24} />
                },
              }}
            />

            <Tabs.Screen
              name="settings"
              options={{
                title: "Settings",
                headerShown: false,
                tabBarButton(props) {
                  return (
                    <GestureDetector gesture={fifthTap}>
                      <View className="flex-1">
                        <PlatformPressable {...props} />
                      </View>
                    </GestureDetector>
                  )
                },
                tabBarIcon: ({ color, focused }) => {
                  const Icon = !focused ? Settings7CuteReIcon : Setting7CuteFi
                  return <Icon color={color} width={24} height={24} />
                },
              }}
            />
          </Tabs>
        </SetBottomTabBarVisibleContext.Provider>
      </BottomTabBarBackgroundContext.Provider>
    </FeedDrawer>
  )
}

const AnimatedThemedBlurView = Animated.createAnimatedComponent(ThemedBlurView)
const TabBarBackground = () => {
  const { opacity } = useContext(BottomTabBarBackgroundContext)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    ...styles.blurEffect,
  }))
  const borderColor = useColor("opaqueSeparator")
  return <AnimatedThemedBlurView style={[styles.blurEffect, animatedStyle, { borderColor }]} />
}

const styles = StyleSheet.create({
  blurEffect: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    backgroundColor: "transparent",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
})
