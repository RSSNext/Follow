import { useAtom } from "jotai"
import { useCallback, useEffect, useRef, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

import { loadingAtom, loadingVisibleAtom } from "@/src/atoms/app"
import { Loading3CuteReIcon } from "@/src/icons/loading_3_cute_re"

import { BlurEffect } from "./HeaderBlur"

export const LoadingContainer = () => {
  const rotate = useSharedValue(0)

  const [visible, setVisible] = useAtom(loadingVisibleAtom)
  const [showCancelButton, setShowCancelButton] = useState(false)

  const [loadingCaller, setLoadingCaller] = useAtom(loadingAtom)

  const resetLoadingCaller = useCallback(() => {
    setLoadingCaller({
      finish: null,
      cancel: null,
      thenable: null,
      done: null,
      error: null,
    })
  }, [setLoadingCaller])

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      Infinity,
      false,
    )
    return () => {
      rotate.value = 0
    }
  }, [rotate])

  useEffect(() => {
    if (loadingCaller.thenable) {
      loadingCaller.thenable
        .then((r) => {
          loadingCaller.done?.(r)
        })
        .catch((err) => {
          loadingCaller.error?.(err)
        })
        .finally(() => {
          setVisible(false)
          setShowCancelButton(false)

          resetLoadingCaller()

          loadingCaller.finish?.()
        })
    }
  }, [loadingCaller.thenable, loadingCaller.done, loadingCaller.error, loadingCaller.finish])

  const cancelTimerRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    cancelTimerRef.current = setTimeout(() => {
      setShowCancelButton(true)
    }, 3000)
    return () => {
      if (cancelTimerRef.current) {
        clearTimeout(cancelTimerRef.current)
      }
    }
  }, [])

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }))

  const cancel = () => {
    setVisible(false)
    setShowCancelButton(false)

    if (loadingCaller.cancel) {
      loadingCaller.cancel()
    }
    resetLoadingCaller()
  }

  if (!visible) {
    return null
  }

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="absolute inset-0 flex-1 items-center justify-center"
    >
      <View className="border-system-fill/40 relative rounded-2xl border p-12">
        <BlurEffect />
        <Animated.View style={rotateStyle}>
          <Loading3CuteReIcon height={36} width={36} color="#fff" />
        </Animated.View>
      </View>

      {showCancelButton && (
        <View className="absolute inset-x-0 bottom-24 flex-row justify-center">
          <TouchableOpacity onPress={cancel}>
            <Text className="text-center text-lg text-accent">Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  )
}
