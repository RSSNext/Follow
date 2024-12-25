import { Stack } from "expo-router"

export default function AppRootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="add"
        options={{
          headerShown: true,
          presentation: "modal",
          title: "Add Subscription",
        }}
      />
    </Stack>
  )
}
