import { Stack } from "expo-router"
import { useState } from "react"
import { useColorScheme } from "react-native"

import { SharedElementAnimationContextProvider } from "@/src/modules/entry/ctx"
import { getSystemBackgroundColor } from "@/src/theme/utils"

export default function HeadlessLayout() {
  useColorScheme()
  const systemBackgroundColor = getSystemBackgroundColor()
  const [shouldAnimate, setShouldAnimate] = useState(true)
  return (
    <SharedElementAnimationContextProvider value={shouldAnimate}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: systemBackgroundColor },
          headerShown: false,
        }}
        screenListeners={{
          transitionEnd: (e) => {
            // disable shared element animation when navigating back to the start screen
            const screenToStart = "index"

            if (e.target?.startsWith(screenToStart)) {
              setShouldAnimate(!e.data.closing)
            }
          },
        }}
      />
    </SharedElementAnimationContextProvider>
  )
}
