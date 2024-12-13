import "../global.css"

import { Stack } from "expo-router"
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
      <TouchableOpacity
        onPress={() => {
          const current = colorScheme.get()
          colorScheme.set(current === "dark" ? "light" : "dark")
        }}
        style={{
          position: "absolute",
          bottom: insets.bottom,
          right: insets.right,
        }}
      >
        <Text className="text-accent">Toggle Color mode ({current.colorScheme})</Text>
      </TouchableOpacity>
    </View>
  )
}
