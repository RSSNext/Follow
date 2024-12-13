import { Tabs } from "expo-router"

import { PicCuteFiIcon } from "@/src/components/icons/pic_cute_fi"

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#FF5C00" }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <PicCuteFiIcon color={color} />,
        }}
      />
    </Tabs>
  )
}
