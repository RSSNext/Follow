import "../global.css"

import { Stack } from "expo-router"
import { useColorScheme } from "nativewind"

import { DebugButton } from "../modules/debug"
import { RootProviders } from "../providers"
import { usePrefetchSessionUser } from "../store/user/hooks"
import { getSystemBackgroundColor } from "../theme/utils"

export default function RootLayout() {
  useColorScheme()

  const systemBackgroundColor = getSystemBackgroundColor()

  return (
    <RootProviders>
      <Session />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: systemBackgroundColor },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(stack)" options={{ headerShown: false }} />
        <Stack.Screen name="(headless)" options={{ headerShown: false }} />
        <Stack.Screen name="(modal)" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen
          name="player"
          options={{
            presentation: "transparentModal",
            headerShown: false,
            contentStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
      </Stack>

      {__DEV__ && <DebugButton />}
    </RootProviders>
  )
}

const Session = () => {
  usePrefetchSessionUser()
  return null
}
