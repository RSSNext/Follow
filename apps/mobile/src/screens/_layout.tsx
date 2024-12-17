import "../global.css"

import { ThemeProvider } from "@react-navigation/native"
import { Link, Stack } from "expo-router"
import { useColorScheme } from "nativewind"
import { TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { getCurrentColors, getSystemBackgroundColor } from "../theme/colors"
import { DarkTheme, DefaultTheme } from "../theme/navigation"

export default function RootLayout() {
  const insets = useSafeAreaInsets()
  const { colorScheme } = useColorScheme()

  const currentThemeColors = getCurrentColors()!

  const systemBackgroundColor = getSystemBackgroundColor()

  return (
    <View style={[{ flex: 1 }, currentThemeColors]}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: systemBackgroundColor },
            headerShown: false,
          }}
        >
          <Stack.Screen name="(stack)" options={{ headerShown: false }} />
          <Stack.Screen name="(headless)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>

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
  )
}
