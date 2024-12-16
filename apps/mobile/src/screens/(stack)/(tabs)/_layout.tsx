import { Tabs } from "@/src/components/common/BottomTabs"

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="feed-list"
        options={{
          title: "Subscriptions",
          headerShown: false,
          tabBarIcon: () => require("@/src/icons/tab/follow.svg"),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          headerShown: false,
          tabBarIcon: () => require("@/src/icons/tab/safari.svg"),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: () => require("@/src/icons/tab/settings.svg"),
        }}
      />
    </Tabs>
    // </View>
  )
}
