import { Tabs } from "expo-router"
import { StyleSheet } from "react-native"

import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"
import { FollowIcon } from "@/src/components/ui/logo"
import { SafariCuteFi } from "@/src/icons/safari_cute_fi"
import { SafariCuteIcon } from "@/src/icons/safari_cute-re"
import { Setting7CuteFi } from "@/src/icons/setting_7_cute_fi"
import { Settings7CuteReIcon } from "@/src/icons/settings_7_cute_re"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarBackground: () => (
          <ThemedBlurView
            intensity={80}
            style={{
              ...StyleSheet.absoluteFillObject,
              overflow: "hidden",
              backgroundColor: "transparent",
            }}
          />
        ),
        tabBarStyle: {
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="feed-list"
        options={{
          title: "Subscriptions",
          headerShown: false,
          tabBarIcon: ({ color }) => <FollowIcon color={color} style={{ width: 20, height: 20 }} />,
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
          tabBarIcon: ({ color, focused }) => {
            const Icon = !focused ? Settings7CuteReIcon : Setting7CuteFi
            return <Icon color={color} width={24} height={24} />
          },
        }}
      />
    </Tabs>
  )
}
