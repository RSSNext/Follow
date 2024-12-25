import "../global.css"

import { Stack } from "expo-router"
import { useColorScheme } from "nativewind"

import { DebugButton } from "../modules/debug"
import { RootProviders } from "../providers"
import { getSystemBackgroundColor } from "../theme/colors"

export default function RootLayout() {
  useColorScheme()
  const systemBackgroundColor = getSystemBackgroundColor()

  return (
    <RootProviders>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: systemBackgroundColor },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(stack)" options={{ headerShown: false }} />
        <Stack.Screen name="(headless)" options={{ headerShown: false }} />
      </Stack>

      {__DEV__ && <DebugButton />}
    </RootProviders>
  )
}
