import "../global.css"

import { Link, Stack } from "expo-router"
import { TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { RootProviders } from "../providers"
import { getCurrentColors, getSystemBackgroundColor } from "../theme/colors"

export default function RootLayout() {
  const insets = useSafeAreaInsets()

  const currentThemeColors = getCurrentColors()!

  const systemBackgroundColor = getSystemBackgroundColor()

  return (
    <RootProviders>
      <View style={[{ flex: 1 }, currentThemeColors]}>
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
            className="absolute size-5 rounded-r-md bg-accent"
          />
        </Link>
      </View>
    </RootProviders>
  )
}