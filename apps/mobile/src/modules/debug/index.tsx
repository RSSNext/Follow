import { router } from "expo-router"
import { useRef, useState } from "react"
import { Animated, Dimensions, PanResponder } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BugCuteReIcon } from "@/src/icons/bug_cute_re"

export const DebugButton = () => {
  const insets = useSafeAreaInsets()
  const windowWidth = Dimensions.get("window").width
  const pan = useRef(
    new Animated.ValueXY({
      x: insets.left,
      y: 50,
    }),
  ).current
  const [position, setPosition] = useState({ x: 0, y: 50 })

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      const newX = position.x + gesture.dx
      const newY = position.y + gesture.dy

      pan.setValue({ x: newX, y: newY })
    },

    onPanResponderRelease: (_, gesture) => {
      if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
        router.push("/debug")

        return
      }

      const newY = position.y + gesture.dy

      const snapToLeft = true
      const finalX = snapToLeft ? insets.left : windowWidth - 40 - insets.right

      Animated.spring(pan, {
        toValue: { x: finalX, y: newY },
        useNativeDriver: false,
      }).start()

      setPosition({ x: finalX, y: newY })
    },
  })

  return (
    <Animated.View
      style={{
        position: "absolute",
        right: 0,
        top: -20,
        zIndex: 1000,
        transform: pan.getTranslateTransform(),
      }}
      {...panResponder.panHandlers}
      className="absolute mt-5 flex size-8 items-center justify-center rounded-l-md bg-accent"
    >
      <BugCuteReIcon height={24} width={24} color="#fff" />
    </Animated.View>
  )
}
