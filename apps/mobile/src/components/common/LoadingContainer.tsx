import { useAtom } from "jotai"
import { useCallback, useEffect, useRef, useState } from "react"
import { Modal, Text, TouchableOpacity, View } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

import { loadingAtom, loadingVisibleAtom } from "@/src/atoms/app"
import { Loading3CuteReIcon } from "@/src/icons/loading_3_cute_re"

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
      loadingCaller.thenable.finally(() => {
        setVisible(false)
        setShowCancelButton(false)

        resetLoadingCaller()

        loadingCaller.finish?.()
      })
    }
  }, [loadingCaller.thenable])

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

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 items-center justify-center bg-black/30">
        <View className="border-system-fill/40 rounded-2xl border bg-black/50 p-12 drop-shadow dark:bg-white/5">
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
      </View>
    </Modal>
  )
}
