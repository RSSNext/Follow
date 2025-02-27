import { cn, getLuminance, shadeColor } from "@follow/utils"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useEffect, useMemo } from "react"
import { StyleSheet, Text, View } from "react-native"
import Reanimated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { SheetScreen } from "react-native-sheet-transitions"

import { useActiveTrack, useIsPlaying } from "../lib/player"
import { PlayerScreenContext } from "../modules/player/context"
import { ControlGroup, ProgressBar, VolumeBar } from "../modules/player/control"
import { useImageColors, usePrefetchImageColors } from "../store/image/hooks"

const defaultBackgroundColor = "#000000"

function CoverArt({ cover }: { cover?: string }) {
  const scale = useSharedValue(1)
  const { playing } = useIsPlaying()

  useEffect(() => {
    scale.value = playing ? 1 : 0.7
  }, [playing])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value) }],
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
  const imageColors = useImageColors(activeTrack?.artwork)
  // const [backgroundColor, setBackgroundColor] = useState(defaultBackgroundColor)
  // const [isGradientLight, setIsGradientLight] = useState(false)
  const backgroundColor = useMemo(() => {
    if (imageColors?.platform === "ios") {
      return imageColors.background
    } else if (imageColors?.platform === "android") {
      return imageColors.average
    }
    return defaultBackgroundColor
  }, [imageColors])
  const isGradientLight = useMemo(() => {
    return getLuminance(backgroundColor) > 0.5
  }, [backgroundColor])

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
        <View className="flex-1 px-[1000] p-safe">
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={[backgroundColor, shadeColor(backgroundColor, -50)]}
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
    <View className="absolute inset-x-0 flex items-center justify-center top-safe-offset-2">
      <View className="bg-tertiary-label h-[5] w-[40] rounded-full" />
    </View>
  )
}
