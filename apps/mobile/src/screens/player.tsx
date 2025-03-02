import { cn } from "@follow/utils"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useEffect, useMemo } from "react"
import { StyleSheet, Text, View } from "react-native"
import Reanimated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { SheetScreen } from "react-native-sheet-transitions"

import { gentleSpringPreset } from "../constants/spring"
import { useActiveTrack, useIsPlaying } from "../lib/player"
import { PlayerScreenContext } from "../modules/player/context"
import { ControlGroup, ProgressBar, VolumeBar } from "../modules/player/control"
import { useCoverGradient } from "../modules/player/hooks"
import { usePrefetchImageColors } from "../store/image/hooks"

function CoverArt({ cover }: { cover?: string }) {
  const scale = useSharedValue(1)
  const { playing } = useIsPlaying()

  useEffect(() => {
    cancelAnimation(scale)
    scale.value = withSpring(playing ? 1 : 0.7, gentleSpringPreset)
  }, [playing, scale])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  return (
    <Reanimated.View className="mx-auto my-12 aspect-square w-[87%] shadow" style={[animatedStyle]}>
      <Image source={cover} className="size-full rounded-lg" />
    </Reanimated.View>
  )
}

export default function PlaterScreen() {
  const activeTrack = useActiveTrack()
  usePrefetchImageColors(activeTrack?.artwork)

  const { gradientColors, isGradientLight } = useCoverGradient(activeTrack?.artwork)

  const playerScreenContextValue = useMemo(
    () => ({ isBackgroundLight: isGradientLight }),
    [isGradientLight],
  )

  if (!activeTrack) {
    return null
  }

  return (
    <SheetScreen onClose={() => router.back()}>
      <PlayerScreenContext.Provider value={playerScreenContextValue}>
        <View className="p-safe flex-1 px-[1000]">
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <DismissIndicator />
          <CoverArt cover={activeTrack.artwork} />
          <View className="mx-10 flex-1">
            <Text
              className={cn(
                "text-xl font-bold opacity-90",
                isGradientLight ? "text-black" : "text-white",
              )}
              numberOfLines={1}
            >
              {activeTrack.title}
            </Text>
            <Text
              className={cn(
                "mt-2 text-xl font-semibold opacity-60",
                isGradientLight ? "text-black" : "text-white",
              )}
              numberOfLines={1}
            >
              {activeTrack.artist}
            </Text>
            <ProgressBar />
            <ControlGroup />
            <View className="flex-1" />
            <VolumeBar />
          </View>
        </View>
      </PlayerScreenContext.Provider>
    </SheetScreen>
  )
}

function DismissIndicator() {
  return (
    <View className="top-safe-offset-2 absolute inset-x-0 flex items-center justify-center">
      <View className="bg-tertiary-label h-[5] w-[40] rounded-full" />
    </View>
  )
}
