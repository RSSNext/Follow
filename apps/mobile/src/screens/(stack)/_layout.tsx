import { Redirect, Stack } from "expo-router"

import { useWhoami } from "@/src/store/user/hooks"

export default function AppRootLayout() {
  const whoami = useWhoami()

  if (!whoami?.id) {
    return <Redirect href="/login" />
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}
