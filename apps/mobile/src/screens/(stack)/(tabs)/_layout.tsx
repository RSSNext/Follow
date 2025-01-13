import { FeedViewType } from "@follow/constants"
import { PlatformPressable } from "@react-navigation/elements/src/PlatformPressable"
import { router, Tabs } from "expo-router"
import { Easing, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"

import { BlurEffect } from "@/src/components/common/HeaderBlur"
import { FollowIcon } from "@/src/components/ui/logo"
import { SafariCuteFi } from "@/src/icons/safari_cute_fi"
import { SafariCuteIcon } from "@/src/icons/safari_cute-re"
import { Setting7CuteFi } from "@/src/icons/setting_7_cute_fi"
import { Settings7CuteReIcon } from "@/src/icons/settings_7_cute_re"
import { setCurrentView } from "@/src/modules/subscription/atoms"

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
  return (
    <Tabs
      screenOptions={{
        tabBarBackground: BlurEffect,
        tabBarStyle: {
          position: "absolute",
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
        name="subscription"
        options={{
          title: "Subscriptions",
          headerShown: false,
          tabBarIcon: ({ color }) => <FollowIcon color={color} style={{ width: 20, height: 20 }} />,
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
  )
}
