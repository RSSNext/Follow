import { router, Tabs } from "expo-router"
import { useContext, useEffect, useMemo, useState } from "react"
import {
  Animated as RNAnimated,
  Easing,
  Pressable,
  StyleSheet,
  useAnimatedValue,
  View,
} from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated"

import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"
import { BottomTabBarBackgroundContext } from "@/src/contexts/BottomTabBarBackgroundContext"
import { SetBottomTabBarVisibleContext } from "@/src/contexts/BottomTabBarVisibleContext"
import { BlackBoard2CuteFiIcon } from "@/src/icons/black_board_2_cute_fi"
import { BlackBoard2CuteReIcon } from "@/src/icons/black_board_2_cute_re"
import { Home5CuteFiIcon } from "@/src/icons/home_5_cute_fi"
import { Home5CuteReIcon } from "@/src/icons/home_5_cute_re"
import { Search3CuteFiIcon } from "@/src/icons/search_3_cute_fi"
import { Search3CuteReIcon } from "@/src/icons/search_3_cute_re"
import { Settings1CuteFiIcon } from "@/src/icons/settings_1_cute_fi"
import { Settings1CuteReIcon } from "@/src/icons/settings_1_cute_re"
import { useColor } from "@/src/theme/colors"

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
              title: "Home",
              headerShown: false,
              tabBarLabel: "Timeline",
              tabBarIcon: ({ color, focused }) => {
                const Icon = !focused ? Home5CuteReIcon : Home5CuteFiIcon
                return <Icon color={color} width={24} height={24} />
              },
              tabBarButton(props) {
                return <Pressable {...props} />
              },
            }}
          />
          <Tabs.Screen
            name="subscriptions"
            options={{
              title: "Subscriptions",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => {
                const Icon = !focused ? BlackBoard2CuteReIcon : BlackBoard2CuteFiIcon
                return <Icon color={color} width={24} height={24} />
              },
              tabBarLabel: "Subscriptions",

              tabBarButton(props) {
                return <Pressable {...props} />
              },
            }}
          />
          <Tabs.Screen
            name="discover"
            options={{
              title: "Discover",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => {
                const Icon = !focused ? Search3CuteReIcon : Search3CuteFiIcon
                return <Icon color={color} width={24} height={24} />
              },
              tabBarButton(props) {
                return <Pressable {...props} />
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
                      <Pressable {...props} />
                    </View>
                  </GestureDetector>
                )
              },
              tabBarIcon: ({ color, focused }) => {
                const Icon = !focused ? Settings1CuteReIcon : Settings1CuteFiIcon
                return <Icon color={color} width={24} height={24} />
              },
            }}
          />
        </Tabs>
      </SetBottomTabBarVisibleContext.Provider>
    </BottomTabBarBackgroundContext.Provider>
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
