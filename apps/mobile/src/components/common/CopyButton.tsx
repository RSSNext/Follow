import { cn } from "@follow/utils/src/utils"
import { useRef } from "react"
import { Pressable } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated"
import { useEventCallback } from "usehooks-ts"

import { CheckFilledIcon } from "@/src/icons/check_filled"
import { Copy2CuteReIcon } from "@/src/icons/copy_2_cute_re"

type Size = "sm" | "md"
interface CopyButtonProps {
  onCopy: () => void
  className?: string
  size?: Size
}

const sizeClassNames = {
  sm: "size-8",
  md: "size-10",
}

const sizeIconSize = {
  sm: 18,
  md: 20,
}

export const CopyButton = ({ onCopy, className, size = "sm" }: CopyButtonProps) => {
  const initialIconScale = useSharedValue(1)
  const pressedIconScale = useSharedValue(0)
  const initialStyle = useAnimatedStyle(() => ({
    transform: [{ scale: initialIconScale.value }],
  }))

  const pressedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    transform: [{ scale: pressedIconScale.value }],
  }))

  const animatedProgressingRef = useRef(false)
  const handlePress = useEventCallback(() => {
    onCopy()
    if (animatedProgressingRef.current) return
    animatedProgressingRef.current = true
    initialIconScale.value = withTiming(0, { duration: 100 }, () => {
      pressedIconScale.value = withTiming(1, { duration: 100 }, () => {
        pressedIconScale.value = withDelay(
          1000,
          withTiming(0, { duration: 100 }, () => {
            initialIconScale.value = withTiming(1, { duration: 100 }, () => {
              animatedProgressingRef.current = false
            })
          }),
        )
      })
    })
  })
  return (
    <Pressable
      className={cn(
        "bg-red items-center justify-center rounded-lg",
        sizeClassNames[size],
        className,
      )}
      onPress={handlePress}
    >
      <Animated.View style={initialStyle}>
        <Copy2CuteReIcon color="#fff" height={sizeIconSize[size]} width={sizeIconSize[size]} />
      </Animated.View>
      <Animated.View style={pressedStyle}>
        <CheckFilledIcon color="#fff" height={sizeIconSize[size]} width={sizeIconSize[size]} />
      </Animated.View>
    </Pressable>
  )
}
