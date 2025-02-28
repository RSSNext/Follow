import { cn } from "@follow/utils"
import { Image } from "expo-image"
import { router, usePathname } from "expo-router"
import { useEffect } from "react"
import { Pressable, Text, View } from "react-native"
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

import { useActiveTrack } from "@/src/lib/player"
import { usePrefetchImageColors } from "@/src/store/image/hooks"

import { PlayPauseButton, SeekButton } from "./control"

const allowedRoutes = new Set(["/", "/subscriptions", "/player"])

export function PlayerTabBar({ className }: { className?: string }) {
  const activeTrack = useActiveTrack()
  const pathname = usePathname()
  const isVisible = !!activeTrack && allowedRoutes.has(pathname)
  const isVisibleSV = useSharedValue(isVisible ? 1 : 0)
  useEffect(() => {
    isVisibleSV.value = withTiming(isVisible ? 1 : 0)
  }, [pathname, isVisible])
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: isVisibleSV.value,
      height: interpolate(isVisibleSV.value, [0, 1], [0, 56]),
      overflow: "hidden",
    }
  })

  usePrefetchImageColors(activeTrack?.artwork)

  return (
    <Animated.View
      style={animatedStyle}
      className={cn("border-opaque-separator/70 border-b px-2", className)}
    >
      <Pressable
        onPress={() => {
          router.push("/player")
        }}
      >
        <View className="flex flex-row items-center gap-4 overflow-hidden rounded-2xl p-2">
          <Image source={activeTrack?.artwork} className="size-12 rounded-lg" />
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
