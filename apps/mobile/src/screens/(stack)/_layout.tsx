import { Stack } from "expo-router"

import { accentColor } from "@/src/theme/colors"

export default function AppRootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitleStyle: { color: "system" },
        headerTintColor: accentColor,
      }}
    >
      <Stack.Screen name="add" options={{ headerShown: true, title: "Add Subscription" }} />
    </Stack>
  )
}
