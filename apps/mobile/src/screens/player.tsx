import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import ImageColors from "react-native-image-colors"
import { SheetScreen } from "react-native-sheet-transitions"

import { useActiveTrack } from "../lib/player"
import { ControlGroup, ProgressBar, VolumeBar } from "../modules/player/control"

const defaultBackgroundColor = "#000000"

export default function PlaterScreen() {
  const activeTrack = useActiveTrack()

  const [backgroundColor, setBackgroundColor] = useState(defaultBackgroundColor)
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
        setBackgroundColor(result.background)
      } else {
        setBackgroundColor(result.average)
      }
    }

    extractColors()
  }, [activeTrack?.artwork])

  if (!activeTrack) {
    return null
  }

  return (
    <SheetScreen
      onClose={() => router.back()}
      dragDirections={{ toBottom: true, toTop: false, toLeft: false, toRight: false }}
      containerRadiusSync={true}
    >
      <View className="flex-1 p-safe">
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
        <Text className="text-label mx-6 text-xl font-bold opacity-90" numberOfLines={1}>
          {activeTrack.title}
        </Text>
        <Text className="text-label mx-6 mt-2 text-xl font-semibold opacity-60" numberOfLines={1}>
          {activeTrack.artist}
        </Text>
        <ProgressBar />
        <ControlGroup />
        <View className="flex-1" />
        <VolumeBar />
      </View>
    </SheetScreen>
  )
}

function DismissIndicator() {
  return (
    <View className="absolute inset-x-0 flex items-center justify-center top-safe-offset-2">
      <View className="h-[5] w-[40] rounded-full bg-white/45" />
    </View>
  )
}

function shadeColor(color: string, percent: number): string {
  const R = Number.parseInt(color.slice(1, 3), 16)
  const G = Number.parseInt(color.slice(3, 5), 16)
  const B = Number.parseInt(color.slice(5, 7), 16)

  let newR = Math.round((R * (100 + percent)) / 100)
  let newG = Math.round((G * (100 + percent)) / 100)
  let newB = Math.round((B * (100 + percent)) / 100)

  newR = Math.min(newR, 255)
  newG = Math.min(newG, 255)
  newB = Math.min(newB, 255)

  const RR = newR.toString(16).length === 1 ? `0${newR.toString(16)}` : newR.toString(16)
  const GG = newG.toString(16).length === 1 ? `0${newG.toString(16)}` : newG.toString(16)
  const BB = newB.toString(16).length === 1 ? `0${newB.toString(16)}` : newB.toString(16)

  return `#${RR}${GG}${BB}`
}
