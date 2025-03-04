import "../global.css"

import { Stack } from "expo-router"
import { useColorScheme } from "nativewind"
import { useSheet } from "react-native-sheet-transitions"

import { DebugButton } from "../modules/debug"
import { RootProviders } from "../providers"
import { usePrefetchSessionUser } from "../store/user/hooks"
import { getSystemBackgroundColor } from "../theme/utils"

export default function RootLayout() {
  useColorScheme()

  return (
    <RootProviders>
      <Session />
      <AnimatedStack />

      {__DEV__ && <DebugButton />}
    </RootProviders>
  )
}

function AnimatedStack() {
  const systemBackgroundColor = getSystemBackgroundColor()
  const { isScaling } = useSheet()

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: systemBackgroundColor },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(stack)"
        options={{
          title: "Follow",
          headerShown: false,
          contentStyle: isScaling ? { borderRadius: 50, overflow: "hidden" } : {},
        }}
      />
      <Stack.Screen name="(headless)" options={{ headerShown: false, title: "Follow" }} />
      <Stack.Screen
        name="(modal)"
        options={{ headerShown: false, presentation: "modal", title: "Modal" }}
      />
      <Stack.Screen
        name="player"
        options={{
          title: "Player",
          presentation: "transparentModal",
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
    </Stack>
  )
}

const Session = () => {
  usePrefetchSessionUser()
  return null
}
