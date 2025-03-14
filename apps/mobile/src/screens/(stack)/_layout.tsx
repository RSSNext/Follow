import { Stack } from "expo-router"
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated"
import { useSheet } from "react-native-sheet-transitions"

import { useOnboarding } from "@/src/store/user/hooks"

export default function AppRootLayout() {
  useOnboarding()
  const { scale } = useSheet()

  const style = useAnimatedStyle(() => ({
    borderRadius: interpolate(scale.value, [0.8, 0.99, 1], [0, 50, 0]),
  }))
  return (
    <Animated.View className={"flex-1 overflow-hidden"} style={style}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </Animated.View>
  )
}
