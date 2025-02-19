import { cn } from "@follow/utils"
import { Image } from "expo-image"
import { Text, View } from "react-native"
import ReAnimated, { SlideInDown, SlideOutDown } from "react-native-reanimated"

import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"
import { useActiveTrack } from "@/src/lib/player"

import { PlayPauseButton, SeekButton } from "./control"

export function FloatingBar({ className }: { className?: string }) {
  const activeTrack = useActiveTrack()
  if (!activeTrack) {
    return null
  }

  return (
    <ReAnimated.View
      className={cn("mx-4 shadow-md", className)}
      entering={SlideInDown}
      exiting={SlideOutDown}
    >
      <ThemedBlurView className="flex flex-row items-center gap-4 overflow-hidden rounded-2xl p-2">
        <Image source={activeTrack.artwork} className="size-12 rounded-lg" />
        <View className="flex-1 overflow-hidden">
          <Text className="text-lg font-semibold" numberOfLines={1}>
            {activeTrack.title}
          </Text>
        </View>
        <View className="mr-2 flex flex-row gap-4">
          <PlayPauseButton />
          <SeekButton />
        </View>
      </ThemedBlurView>
    </ReAnimated.View>
  )
}
