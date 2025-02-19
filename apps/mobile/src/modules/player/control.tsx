import { TouchableOpacity, View } from "react-native"
import { useIsPlaying } from "react-native-track-player"

import { Forward2CuteReIcon } from "@/src/icons/forward_2_cute_re"
import { PauseCuteFiIcon } from "@/src/icons/pause_cute_fi"
import { PlayCuteFiIcon } from "@/src/icons/play_cute_fi"
import { pause, play, seekBy } from "@/src/lib/player"

type ControlButtonProps = {
  size?: number
  color?: string
  className?: string
}

export function PlayPauseButton({ size = 24, color, className }: ControlButtonProps) {
  const { playing } = useIsPlaying()
  return (
    <View className={className}>
      <TouchableOpacity
        onPress={() => {
          playing ? pause() : play()
        }}
      >
        {playing ? (
          <PauseCuteFiIcon color={color} width={size} height={size} />
        ) : (
          <PlayCuteFiIcon color={color} width={size} height={size} />
        )}
      </TouchableOpacity>
    </View>
  )
}

export function SeekButton({
  size = 24,
  color,
  className,
  offset = 30,
}: ControlButtonProps & { offset?: number }) {
  return (
    <View className={className}>
      <TouchableOpacity
        onPress={() => {
          seekBy(offset)
        }}
      >
        <Forward2CuteReIcon color={color} width={size} height={size} />
      </TouchableOpacity>
    </View>
  )
}
