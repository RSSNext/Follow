import { cn } from "@follow/utils"
import { Image } from "expo-image"
import { Text, View } from "react-native"
import ReAnimated, { SlideInDown, SlideOutDown } from "react-native-reanimated"

import { useActiveTrack } from "@/src/lib/player"

import { PlayPauseButton, SeekButton } from "./control"

export function FloatingBar({ className }: { className?: string }) {
  const activeTrack = useActiveTrack()
  if (!activeTrack) {
    return null
  }

  return (
    <ReAnimated.View
      className={cn(
        "mx-4 flex flex-row items-center gap-4 rounded-2xl bg-white p-2 shadow-md",
        className,
      )}
      entering={SlideInDown}
      exiting={SlideOutDown}
    >
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
    </ReAnimated.View>
  )
}
