import "../global.css"

import { Link, Stack } from "expo-router"
import { colorScheme, useColorScheme } from "nativewind"
import { Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { getCurrentColors, getSystemBackgroundColor } from "../theme/colors"

export default function RootLayout() {
  const insets = useSafeAreaInsets()
  const current = useColorScheme()

  const currentThemeColors = getCurrentColors()!

  const systemBackgroundColor = getSystemBackgroundColor()

  return (
    <View style={[{ flex: 1 }, currentThemeColors]}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: systemBackgroundColor },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(headless)" options={{ headerShown: false }} />
      </Stack>

      <Link asChild href={"/(headless)/debug"}>
        <TouchableOpacity
          style={{
            position: "absolute",
            left: insets.left,
            top: insets.top,
          }}
          className="absolute size-5 bg-accent"
        />
      </Link>
      <TouchableOpacity
        onPress={() => {
          const current = colorScheme.get()
          colorScheme.set(current === "dark" ? "light" : "dark")
        }}
        style={{
          position: "absolute",
          bottom: insets.bottom + 33,
          right: insets.right,
        }}
      >
        <Text className="text-accent">Toggle Color mode ({current.colorScheme})</Text>
      </TouchableOpacity>
    </View>
  )
}
