import { cn } from "@follow/utils"
import { useEffect } from "react"
import { Pressable, Text, View } from "react-native"
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

import { Image } from "@/src/components/ui/image/Image"
import { useNavigation } from "@/src/lib/navigation/hooks"
import { useScreenName } from "@/src/lib/navigation/ScreenNameContext"
import { useActiveTrack } from "@/src/lib/player"
import { PlayerScreen } from "@/src/screens/player"
import { usePrefetchImageColors } from "@/src/store/image/hooks"

import { PlayPauseButton, SeekButton } from "./control"

const allowedScreenNames = new Set(["Home", "Subscriptions", "Player"])

export function PlayerTabBar({ className }: { className?: string }) {
  const activeTrack = useActiveTrack()
  const screenName = useScreenName()

  const isVisible = !!activeTrack && allowedScreenNames.has(screenName)
  const isVisibleSV = useSharedValue(isVisible ? 1 : 0)
  useEffect(() => {
    isVisibleSV.value = withTiming(isVisible ? 1 : 0)
  }, [isVisible, isVisibleSV])
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: isVisibleSV.value,
      height: interpolate(isVisibleSV.value, [0, 1], [0, 56]),
      overflow: "hidden",
    }
  })

  usePrefetchImageColors(activeTrack?.artwork)
  const navigation = useNavigation()

  return (
    <Animated.View
      style={animatedStyle}
      className={cn("border-opaque-separator/70 border-b px-2", className)}
    >
      <Pressable
        onPress={() => {
          navigation.presentControllerView(PlayerScreen, void 0, "transparentModal")
          // TODO
        }}
      >
        <View className="flex flex-row items-center gap-4 overflow-hidden rounded-2xl p-2">
          <Image source={{ uri: activeTrack?.artwork ?? "" }} className="size-12 rounded-lg" />
          <View className="flex-1 overflow-hidden">
            <Text className="text-label text-lg font-semibold" numberOfLines={1}>
              {activeTrack?.title ?? ""}
            </Text>
          </View>
          <View className="mr-2 flex flex-row gap-4">
            <PlayPauseButton />
            <SeekButton />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  )
}
