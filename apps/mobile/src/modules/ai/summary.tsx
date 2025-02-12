import { cn } from "@follow/utils"
import type { FC } from "react"
import * as React from "react"
import { Text, View } from "react-native"
import Animated, {
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
}> = ({ className, summary, pending = false }) => {
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
    <View className={cn("border-opaque-separator mx-1 rounded-lg border p-3", className)}>
      <View className="flex-row items-center gap-2">
        <Magic2CuteReIcon height={16} width={16} color={labelColor} />
        <Text className="text-label font-medium">AI Summary</Text>
      </View>
      <Animated.View layout={LinearTransition}>
        {pending ? (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="mt-2">
            <Animated.View
              className="bg-secondary-label h-4 w-full rounded"
              style={animatedStyle}
            />
            <Animated.View
              className="bg-secondary-label mt-2 h-4 w-3/5 rounded"
              style={animatedStyle}
            />
          </Animated.View>
        ) : (
          <Animated.Text
            entering={FadeIn}
            exiting={FadeOut}
            className="text-secondary-label mt-1 text-[15px] leading-normal"
          >
            {summary}
          </Animated.Text>
        )}
      </Animated.View>
    </View>
  )
}
