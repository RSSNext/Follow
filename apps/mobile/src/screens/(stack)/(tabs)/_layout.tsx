import { Tabs } from "expo-router"

import { FollowIcon } from "@/src/components/logo"
import { SafariCuteIcon } from "@/src/icons/safari_cute-re"
import { Settings7CuteReIcon } from "@/src/icons/settings_7_cute_re"

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#FF5C00" }}>
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
          tabBarIcon: ({ color }) => (
            <SafariCuteIcon color={color} style={{ width: 20, height: 20 }} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color }) => <Settings7CuteReIcon color={color} width={20} height={20} />,
        }}
      />
    </Tabs>
  )
}
