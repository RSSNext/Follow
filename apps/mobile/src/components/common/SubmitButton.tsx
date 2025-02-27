import { cn } from "@follow/utils"
import { useEffect } from "react"
import type { PressableProps } from "react-native"
import { ActivityIndicator } from "react-native"
import Animated, {
  cancelAnimation,
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
  const disableColor = useColor("gray6")
  const disabledTextColor = useColor("gray2")
  const textColor = useColor("gray6")

  const disabledValue = useSharedValue(1)
  useEffect(() => {
    cancelAnimation(disabledValue)
    disabledValue.value = withTiming(props.disabled ? 1 : 0)
  }, [props.disabled])

  const buttonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(disabledValue.value, [1, 0], [disableColor, accentColor]),
  }))

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(disabledValue.value, [1, 0], [disabledTextColor, textColor]),
  }))

  return (
    <ReAnimatedPressable
      {...props}
      disabled={props.disabled || isLoading}
      style={[buttonStyle, props.style]}
      className={cn("h-[48] flex-row items-center justify-center rounded-2xl", props.className)}
    >
      {isLoading ? (
        <ActivityIndicator className="text-white" />
      ) : (
        <Animated.Text className="text-center text-xl font-semibold" style={textStyle}>
          {title}
        </Animated.Text>
      )}
    </ReAnimatedPressable>
  )
}
