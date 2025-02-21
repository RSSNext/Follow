import { cn, getLuminance, shadeColor } from "@follow/utils"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import ImageColors from "react-native-image-colors"
import { SheetScreen } from "react-native-sheet-transitions"

import { useActiveTrack } from "../lib/player"
import { PlayerScreenContext } from "../modules/player/context"
import { ControlGroup, ProgressBar, VolumeBar } from "../modules/player/control"

const defaultBackgroundColor = "#000000"

export default function PlaterScreen() {
  const activeTrack = useActiveTrack()

  const [backgroundColor, setBackgroundColor] = useState(defaultBackgroundColor)
  const [isGradientLight, setIsGradientLight] = useState(false)

  const playerScreenContextValue = useMemo(
    () => ({ isBackgroundLight: isGradientLight }),
    [isGradientLight],
  )

  useEffect(() => {
    async function extractColors() {
      if (!activeTrack?.artwork) {
        return
      }

      const result = await ImageColors.getColors(activeTrack.artwork, {
        fallback: defaultBackgroundColor,
        cache: true,
      })

      if (result.platform === "web") {
        return
      }

      if (result.platform === "ios") {
        setIsGradientLight(getLuminance(result.background) > 0.5)
        setBackgroundColor(result.background)
      } else {
        setIsGradientLight(getLuminance(result.dominant) > 0.5)
        setBackgroundColor(result.average)
      }
    }

    extractColors()
  }, [activeTrack?.artwork])

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
          <View className="mx-auto my-24 aspect-square w-[65%] shadow">
            <Image source={activeTrack.artwork} className="size-full rounded-lg" />
          </View>
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
