import { Stack } from "expo-router"

export default function AppRootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitleStyle: { color: "system" },
      }}
    >
      <Stack.Screen name="add" options={{ headerShown: true, title: "Add Subscription" }} />
    </Stack>
  )
}
