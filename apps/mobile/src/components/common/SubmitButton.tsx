import { cn } from "@follow/utils"
import { useEffect } from "react"
import type { PressableProps } from "react-native"
import { ActivityIndicator, Text } from "react-native"
import {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useColor } from "react-native-uikit-colors"

import { accentColor } from "@/src/theme/colors"

import { ReAnimatedPressable } from "./AnimatedComponents"

export function SubmitButton({
  isLoading,
  title,
  ...props
}: PressableProps & { isLoading?: boolean; title: string }) {
  const disableColor = useColor("gray3")

  const disabledValue = useSharedValue(1)
  useEffect(() => {
    disabledValue.value = withTiming(props.disabled ? 1 : 0)
  }, [props.disabled])

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(disabledValue.value, [0, 1], [1, 0.5]),
    backgroundColor: interpolateColor(disabledValue.value, [1, 0], [disableColor, accentColor]),
  }))

  return (
    <ReAnimatedPressable
      {...props}
      disabled={props.disabled || isLoading}
      style={[buttonStyle, props.style]}
      className={cn("h-10 flex-row items-center justify-center rounded-3xl", props.className)}
    >
      {isLoading ? (
        <ActivityIndicator className="text-white" />
      ) : (
        <Text className="text-center font-semibold text-white">{title}</Text>
      )}
    </ReAnimatedPressable>
  )
}
