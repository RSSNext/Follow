import { Stack } from "expo-router"

import { useOnboarding } from "@/src/store/user/hooks"

export default function AppRootLayout() {
  useOnboarding()
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}
