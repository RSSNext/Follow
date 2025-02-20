import { cn } from "@follow/utils"
import { router } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"
import { Slider } from "react-native-awesome-slider"
import { useSharedValue } from "react-native-reanimated"
import * as DropdownMenu from "zeego/dropdown-menu"

import { Back2CuteReIcon } from "@/src/icons/back_2_cute_re"
import { Forward2CuteReIcon } from "@/src/icons/forward_2_cute_re"
import { PauseCuteFiIcon } from "@/src/icons/pause_cute_fi"
import { PlayCuteFiIcon } from "@/src/icons/play_cute_fi"
import { RewindBackward15CuteReIcon } from "@/src/icons/rewind_backward_15_cute_re"
import { RewindForward30CuteReIcon } from "@/src/icons/rewind_forward_30_cute_re"
import { StopCircleCuteFiIcon } from "@/src/icons/stop_circle_cute_fi"
import { VolumeCuteReIcon } from "@/src/icons/volume_cute_re"
import { VolumeOffCuteReIcon } from "@/src/icons/volume_off_cute_re"
import {
  allowedRate,
  pause,
  play,
  reset,
  seekBy,
  seekTo,
  useIsPlaying,
  useProgress,
  useRate,
} from "@/src/lib/player"
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
        {offset === 30 ? (
          <RewindForward30CuteReIcon color={color ?? label} width={size} height={size} />
        ) : offset === -15 ? (
          <RewindBackward15CuteReIcon color={color ?? label} width={size} height={size} />
        ) : offset > 0 ? (
          <Forward2CuteReIcon color={color ?? label} width={size} height={size} />
        ) : (
          <Back2CuteReIcon color={color ?? label} width={size} height={size} />
        )}
      </TouchableOpacity>
    </View>
  )
}

export function RateSelector() {
  const { isBackgroundLight } = usePlayerScreenContext()
  const [currentRate, setCurrentRate] = useRate()

  return (
    <View className="flex-row items-center justify-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Text
            className={cn(
              "text-lg font-bold",
              isBackgroundLight ? "text-black/70" : "text-white/70",
            )}
          >
            {currentRate}x
          </Text>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {allowedRate.map((rate) => (
            <DropdownMenu.CheckboxItem
              value={rate === currentRate}
              key={`${rate}`}
              onSelect={() => setCurrentRate(rate)}
            >
              <DropdownMenu.ItemTitle>{`${rate}x`}</DropdownMenu.ItemTitle>
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </View>
  )
}

export function StopButton({ size = 24, className, color }: ControlButtonProps) {
  const label = useColor("label")
  return (
    <TouchableOpacity
      className={className}
      onPress={() => {
        reset()
        router.back()
      }}
    >
      <StopCircleCuteFiIcon color={color ?? label} width={size} height={size} />
    </TouchableOpacity>
  )
}

export function ControlGroup() {
  const { isBackgroundLight } = usePlayerScreenContext()
  const buttonColor = isBackgroundLight ? "black" : "white"

  return (
    <View className="flex-row items-center justify-around">
      <RateSelector />
      <SeekButton size={35} offset={-15} color={buttonColor} />
      <PlayPauseButton size={50} color={buttonColor} />
      <SeekButton size={35} offset={30} color={buttonColor} />
      <StopButton color={buttonColor} />
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
  const buttonColor = isBackgroundLight ? "black" : "white"

  const { volume, updateVolume } = useVolume()

  const progress = useSharedValue(0)
  const min = useSharedValue(0)
  const max = useSharedValue(1)

  progress.value = volume ?? 0

  return (
    <View className="mx-6 mb-10">
      <View className="flex-row items-center justify-between">
        <VolumeOffCuteReIcon height={15} width={15} color={buttonColor} />
        <View className="flex-1 flex-row px-4">
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
        <VolumeCuteReIcon height={15} width={15} color={buttonColor} />
      </View>
    </View>
  )
}
