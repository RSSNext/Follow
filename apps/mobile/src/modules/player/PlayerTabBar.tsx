import { cn } from "@follow/utils"
import { Image } from "expo-image"
import { router, usePathname } from "expo-router"
import { Pressable, Text, View } from "react-native"
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated"

import { useActiveTrack } from "@/src/lib/player"

import { PlayPauseButton, SeekButton } from "./control"

const allowedRoutes = new Set(["/", "/subscriptions", "/player"])

export function PlayerTabBar({ className }: { className?: string }) {
  const activeTrack = useActiveTrack()
  const pathname = usePathname()
  if (!activeTrack || !allowedRoutes.has(pathname)) {
    return null
  }

  return (
    <View className="mb-2 overflow-hidden">
      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutDown}
        className={cn("border-opaque-separator/70 border-b px-2", className)}
      >
        <Pressable
          onPress={() => {
            router.push("/player")
          }}
        >
          <View className="flex flex-row items-center gap-4 overflow-hidden rounded-2xl p-2">
            <Image source={activeTrack.artwork} className="size-12 rounded-lg" />
            <View className="flex-1 overflow-hidden">
              <Text className="text-label text-lg font-semibold" numberOfLines={1}>
                {activeTrack.title}
              </Text>
            </View>
            <View className="mr-2 flex flex-row gap-4">
              <PlayPauseButton />
              <SeekButton />
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  )
}
