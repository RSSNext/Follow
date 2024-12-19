import "../global.css"

import { Link, Stack } from "expo-router"
import { useColorScheme } from "nativewind"
import { TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BugCuteReIcon } from "../icons/bug_cute_re"
import { RootProviders } from "../providers"
import { getSystemBackgroundColor } from "../theme/colors"

export default function RootLayout() {
  const insets = useSafeAreaInsets()

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

      <Link asChild href={"/debug"}>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 22, left: 10, right: 10 }}
          style={{
            position: "absolute",
            left: insets.left,
            top: insets.top - 24,
          }}
          className="absolute mt-5 flex size-5 items-center justify-center rounded-r-md bg-accent"
        >
          <BugCuteReIcon height={16} width={16} color="#fff" />
        </TouchableOpacity>
      </Link>
    </RootProviders>
  )
}
