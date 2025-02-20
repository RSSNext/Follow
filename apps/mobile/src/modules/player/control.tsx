import { cn } from "@follow/utils"
import { Text, TouchableOpacity, View } from "react-native"
import { Slider } from "react-native-awesome-slider"
import { useSharedValue } from "react-native-reanimated"

import { Back2CuteReIcon } from "@/src/icons/back_2_cute_re"
import { Forward2CuteReIcon } from "@/src/icons/forward_2_cute_re"
import { PauseCuteFiIcon } from "@/src/icons/pause_cute_fi"
import { PlayCuteFiIcon } from "@/src/icons/play_cute_fi"
import { VolumeCuteReIcon } from "@/src/icons/volume_cute_re"
import { VolumeOffCuteReIcon } from "@/src/icons/volume_off_cute_re"
import { pause, play, seekBy, seekTo, useIsPlaying, useProgress } from "@/src/lib/player"
import { useVolume } from "@/src/lib/volume"
import { useColor } from "@/src/theme/colors"

import { usePlayerScreenContext } from "./context"

type ControlButtonProps = {
  size?: number
  className?: string
  color?: string
}

export function PlayPauseButton({ size = 24, className, color }: ControlButtonProps) {
  const { playing } = useIsPlaying()
  const label = useColor("label")
  return (
    <View className={className}>
      <TouchableOpacity
        onPress={() => {
          playing ? pause() : play()
        }}
      >
        {playing ? (
          <PauseCuteFiIcon color={color ?? label} width={size} height={size} />
        ) : (
          <PlayCuteFiIcon color={color ?? label} width={size} height={size} />
        )}
      </TouchableOpacity>
    </View>
  )
}

export function SeekButton({
  size = 24,
  className,
  color,
  offset = 30,
}: ControlButtonProps & { offset?: number }) {
  const label = useColor("label")
  return (
    <View className={className}>
      <TouchableOpacity
        onPress={() => {
          seekBy(offset)
        }}
      >
        {offset > 0 ? (
          <Forward2CuteReIcon color={color ?? label} width={size} height={size} />
        ) : (
          <Back2CuteReIcon color={color ?? label} width={size} height={size} />
        )}
      </TouchableOpacity>
    </View>
  )
}

export function ControlGroup() {
  const { isBackgroundLight } = usePlayerScreenContext()

  return (
    <View className="flex-row items-center justify-center gap-10">
      <SeekButton size={40} offset={-30} color={isBackgroundLight ? "black" : "white"} />
      <PlayPauseButton size={50} color={isBackgroundLight ? "black" : "white"} />
      <SeekButton size={40} offset={30} color={isBackgroundLight ? "black" : "white"} />
    </View>
  )
}

const formatSecondsToMinutes = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  const formattedMinutes = String(minutes).padStart(2, "0")
  const formattedSeconds = String(remainingSeconds).padStart(2, "0")

  return `${formattedMinutes}:${formattedSeconds}`
}

export function ProgressBar() {
  const { isBackgroundLight } = usePlayerScreenContext()

  const { duration, position } = useProgress(250)
  const isSliding = useSharedValue(false)
  const progress = useSharedValue(0)
  const min = useSharedValue(0)
  const max = useSharedValue(1)

  const trackElapsedTime = formatSecondsToMinutes(position)
  const trackRemainingTime = formatSecondsToMinutes(duration - position)

  if (!isSliding.value) {
    progress.value = duration > 0 ? position / duration : 0
  }
  return (
    <View className="m-6">
      <Slider
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        thumbWidth={0}
        containerStyle={{ height: 7, borderRadius: 16 }}
        renderBubble={() => null}
        theme={{
          minimumTrackTintColor: "rgba(255,255,255,0.6)",
          maximumTrackTintColor: "rgba(255,255,255,0.4)",
        }}
        onSlidingStart={() => (isSliding.value = true)}
        onValueChange={async (value) => {
          await seekTo(value * duration)
        }}
        onSlidingComplete={async (value) => {
          if (!isSliding.value) return

          isSliding.value = false

          await seekTo(value * duration)
        }}
      />

      <View className="mt-3 flex-row justify-between">
        <Text
          className={cn(
            "font-mono text-xs font-medium tracking-wider opacity-75",
            isBackgroundLight ? "text-black" : "text-white",
          )}
        >
          {trackElapsedTime}
        </Text>

        <Text
          className={cn(
            "font-mono text-xs font-medium tracking-wider opacity-75",
            isBackgroundLight ? "text-black" : "text-white",
          )}
        >
          {"-"} {trackRemainingTime}
        </Text>
      </View>
    </View>
  )
}

export function VolumeBar() {
  const { isBackgroundLight } = usePlayerScreenContext()

  const { volume, updateVolume } = useVolume()

  const progress = useSharedValue(0)
  const min = useSharedValue(0)
  const max = useSharedValue(1)

  progress.value = volume ?? 0

  return (
    <View className="mx-6 mb-10">
      <View className="flex-row items-center justify-between">
        <VolumeOffCuteReIcon height={15} width={15} color={isBackgroundLight ? "black" : "white"} />
        <View className="flex-1 flex-row px-2">
          <Slider
            progress={progress}
            minimumValue={min}
            containerStyle={{ height: 7, borderRadius: 16 }}
            onValueChange={(value) => {
              updateVolume(value)
            }}
            renderBubble={() => null}
            theme={{
              maximumTrackTintColor: "rgba(255,255,255,0.4)",
              minimumTrackTintColor: "rgba(255,255,255,0.6)",
            }}
            thumbWidth={0}
            maximumValue={max}
          />
        </View>
        <VolumeCuteReIcon height={15} width={15} color={isBackgroundLight ? "black" : "white"} />
      </View>
    </View>
  )
}
