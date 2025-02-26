import { cn } from "@follow/utils"
import type { FC } from "react"
import * as React from "react"
import { Pressable, Text, View } from "react-native"
import Animated, {
  CurvedTransition,
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useColor } from "react-native-uikit-colors"

import { Magic2CuteReIcon } from "@/src/icons/magic_2_cute_re"

export const AISummary: FC<{
  className?: string
  summary: string
  pending?: boolean
  error?: string
  onRetry?: () => void
}> = ({ className, summary, pending = false, error, onRetry }) => {
  const labelColor = useColor("label")

  const opacity = useSharedValue(0.3)

  React.useEffect(() => {
    if (pending) {
      opacity.value = withRepeat(
        withSequence(withTiming(1, { duration: 800 }), withTiming(0.3, { duration: 800 })),
        -1,
      )
    }
  }, [opacity, pending])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      layout={CurvedTransition}
      className={cn("border-system-fill mx-2 rounded-lg border p-3", className)}
    >
      <View className="flex-row items-center gap-2">
        <Magic2CuteReIcon height={16} width={16} color={labelColor} />
        <Text className="text-label font-medium">AI Summary</Text>
      </View>
      <Animated.View layout={LinearTransition}>
        {error ? (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="mt-3">
            <View className="flex-row items-center gap-2">
              <Text className="text-red flex-1 text-[15px]">{error}</Text>
            </View>
            {onRetry && (
              <Pressable onPress={onRetry} className="mt-2">
                <Text className="text-label text-[15px]">Retry</Text>
              </Pressable>
            )}
          </Animated.View>
        ) : pending ? (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="mt-3">
            <Animated.View
              className="bg-quaternary-system-fill h-4 w-4/5 rounded"
              style={animatedStyle}
            />
            <Animated.View
              className="bg-quaternary-system-fill mt-2 h-4 w-3/5 rounded"
              style={animatedStyle}
            />
          </Animated.View>
        ) : (
          <Animated.Text
            entering={FadeIn}
            exiting={FadeOut}
            className="text-secondary-label mt-3 text-[15px] leading-normal"
          >
            {summary.trim()}
          </Animated.Text>
        )}
      </Animated.View>
    </Animated.View>
  )
}
