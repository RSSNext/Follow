import "../global.css"

import analytics from "@react-native-firebase/analytics"
import { Stack, usePathname } from "expo-router"
import { useColorScheme } from "nativewind"
import { useEffect } from "react"
import { useSheet } from "react-native-sheet-transitions"

import { useIntentHandler } from "../hooks/useIntentHandler"
import { DebugButton } from "../modules/debug"
import { RootProviders } from "../providers"
import { usePrefetchSessionUser } from "../store/user/hooks"
import { getSystemBackgroundColor } from "../theme/utils"

export default function RootLayout() {
  useColorScheme()
  useIntentHandler()

  const pathname = usePathname()

  useEffect(() => {
    const logScreenView = async () => {
      try {
        await analytics().logScreenView({
          screen_name: pathname,
          screen_class: pathname,
        })
      } catch (err: any) {
        console.warn(`[Error] logScreenView: ${err}`)
      }
    }
    logScreenView()
  }, [pathname])

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
