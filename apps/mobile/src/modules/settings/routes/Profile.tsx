import { Stack } from "expo-router"
import { Pressable, Text, View } from "react-native"
import { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ReAnimatedScrollView } from "@/src/components/common/AnimatedComponents"
import { MingcuteLeftLineIcon } from "@/src/icons/mingcute_left_line"

import { useSettingsNavigation } from "../hooks"
import { UserHeaderBanner } from "../UserHeaderBanner"

export const ProfileScreen = () => {
  const scrollY = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

  const insets = useSafeAreaInsets()
  const settingNavigation = useSettingsNavigation()
  // const { subscription } = useSubscription()
  return (
    <View className="bg-system-grouped-background flex-1">
      <ReAnimatedScrollView
        onScroll={scrollHandler}
        contentContainerStyle={{ paddingTop: insets.top }}
      >
        <UserHeaderBanner scrollY={scrollY} />

        <Stack.Screen options={{ headerShown: false, animation: "fade" }} />
        <Text>Account</Text>
      </ReAnimatedScrollView>
      <Pressable
        onPress={() => settingNavigation.goBack()}
        className="absolute left-4"
        style={{ top: insets.top }}
      >
        <MingcuteLeftLineIcon color="#fff" />
      </Pressable>
    </View>
  )
}
