import "../global.css"

import { getAnalytics } from "@react-native-firebase/analytics"
import { Stack, usePathname } from "expo-router"
import { useColorScheme } from "nativewind"
import { useEffect } from "react"
import { View } from "react-native"

import { FullWindowOverlay } from "../components/common/FullWindowOverlay"
import { useIntentHandler } from "../hooks/useIntentHandler"
import { DebugButton, EnvProfileIndicator } from "../modules/debug"
import { RootProviders } from "../providers"
import { usePrefetchSessionUser } from "../store/user/hooks"

export default function RootLayout() {
  useColorScheme()
  useIntentHandler()

  const pathname = usePathname()

  useEffect(() => {
    const logScreenView = async () => {
      try {
        await getAnalytics().logScreenView({
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
    <View className="flex-1 bg-black">
      <RootProviders>
        <Session />

        <AnimatedStack />

        {__DEV__ && <DebugButton />}
        <FullWindowOverlay>
          <EnvProfileIndicator />
        </FullWindowOverlay>
      </RootProviders>
    </View>
  )
}

function AnimatedStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#000",
        },
      }}
    >
      <Stack.Screen
        name="(stack)"
        options={{
          title: "Follow",
          headerShown: false,
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
      <Stack.Screen
        name="onboarding"
        options={{
          title: "Onboarding",
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
