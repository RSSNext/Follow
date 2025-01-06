import { Stack } from "expo-router"

export default function AppRootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}
