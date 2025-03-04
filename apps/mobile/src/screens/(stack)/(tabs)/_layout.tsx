import { router, Stack, Tabs } from "expo-router"
import { Easing } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"

import { BottomTabs } from "@/src/components/layouts/tabbar/BottomTabs"
import { BlackBoard2CuteFiIcon } from "@/src/icons/black_board_2_cute_fi"
import { BlackBoard2CuteReIcon } from "@/src/icons/black_board_2_cute_re"
import { Home5CuteFiIcon } from "@/src/icons/home_5_cute_fi"
import { Home5CuteReIcon } from "@/src/icons/home_5_cute_re"
import { Search3CuteFiIcon } from "@/src/icons/search_3_cute_fi"
import { Search3CuteReIcon } from "@/src/icons/search_3_cute_re"
import { Settings1CuteFiIcon } from "@/src/icons/settings_1_cute_fi"
import { Settings1CuteReIcon } from "@/src/icons/settings_1_cute_re"

const fifthTap = Gesture.Tap()
  .numberOfTaps(5)
  .onStart(() => {
    runOnJS(router.push)("/debug")
  })

export default function TabLayout() {
  return (
    <>
      {/* Set navigation screen title */}
      <Stack.Screen
        options={{
          title: "Follow",
        }}
      />
      <BottomTabs
        screenOptions={{
          title: "Follow",
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
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: false,
            tabBarButton(props) {
              return <GestureDetector gesture={fifthTap}>{props.children}</GestureDetector>
            },
            tabBarIcon: ({ color, focused }) => {
              const Icon = !focused ? Settings1CuteReIcon : Settings1CuteFiIcon
              return <Icon color={color} width={24} height={24} />
            },
          }}
        />
      </BottomTabs>
    </>
  )
}
