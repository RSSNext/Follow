import { Image } from "expo-image"
import { useEffect, useState } from "react"
import { Dimensions, Modal, Pressable, useWindowDimensions, View } from "react-native"
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"

import { gentleSpringPreset } from "@/src/constants/spring"
import { CloseCuteReIcon } from "@/src/icons/close_cute_re"

interface PreviewImageProps {
  imageUrl: string
  blurhash?: string | undefined
  aspectRatio: number
}

export const PreviewImage = ({ imageUrl, blurhash, aspectRatio }: PreviewImageProps) => {
  const { width, height } = useWindowDimensions()
  const [previewModalOpen, setPreviewModalOpen] = useState(false)

  const [imageRef, setImageRef] = useState<View | null>(null)
  const layoutScale = useSharedValue(1)
  const layoutTransformX = useSharedValue(0)
  const layoutTransformY = useSharedValue(0)

  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const pinchCenter = useSharedValue({ x: 0, y: 0 })
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const savedTranslateX = useSharedValue(0)
  const savedTranslateY = useSharedValue(0)
  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      pinchCenter.value = { x: e.focalX, y: e.focalY }
    })
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale
      // Limit scale to 1 to 3
      scale.value = Math.min(Math.max(scale.value, 1), 3)
    })
    .onEnd(() => {
      savedScale.value = scale.value
    })

  // Animation closing state
  const isClosing = useSharedValue(false)

  // Animation opacity value
  const opacity = useSharedValue(1)

  // Overlay opacity animation value
  const overlayOpacity = useSharedValue(0)

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((e) => {
      if (isClosing.value) return

      if (scale.value === 1 && e.translationY > 0) {
        translateY.value = savedTranslateY.value + e.translationY * 0.5
        translateX.value = savedTranslateX.value + e.translationX * 0.5
        const progress = Math.abs(e.translationY) / (height * 2)
        scale.value = Math.max(0.8, 1 - progress)
        opacity.value = Math.max(0.3, 1 - progress * 1.5)
        // Update overlay opacity simultaneously
        overlayOpacity.value = Math.max(0, 0.9 - progress * 1.5)
      } else {
        translateX.value = savedTranslateX.value + e.translationX
        translateY.value = savedTranslateY.value + e.translationY
      }
    })
    .onEnd((e) => {
      if (isClosing.value) return

      if (scale.value <= 1 && e.translationY > 100) {
        isClosing.value = true

        // Measure original image position
        imageRef?.measureInWindow((pageX, pageY, w1, h1) => {
          const duration = 300

          overlayOpacity.value = withTiming(0, {
            duration,
          })

          opacity.value = withTiming(0, {
            duration,
          })

          const { width: w2 } = Dimensions.get("window")
          const s = w2 / w1

          const x1 = pageX + w1 / 2
          const y1 = pageY + h1 / 2
          const x2 = w2 / 2
          const y2 = height / 2

          const xDelta = (x1 - x2) * s
          const yDelta = (y1 - y2) * s

          layoutScale.value = withTiming(
            1 / s,
            {
              duration,
            },
            (finished) => {
              if (finished) {
                runOnJS(setPreviewModalOpen)(false)
              }
            },
          )
          layoutTransformX.value = withTiming(xDelta, {
            duration,
          })
          layoutTransformY.value = withTiming(yDelta, {
            duration,
          })

          scale.value = withTiming(1, {
            duration,
          })
          translateX.value = withTiming(0, {
            duration,
          })
          translateY.value = withTiming(0, {
            duration,
          })
        })
      } else {
        // Restore opacity
        opacity.value = withTiming(1, {
          duration: 100,
        })
        overlayOpacity.value = withTiming(0.9, {
          duration: 100,
        })
        // Boundary check logic
        const scaledWidth = width * scale.value
        const scaledHeight = height * aspectRatio * scale.value

        // Calculate maximum allowed offset
        const maxOffsetX = Math.max(0, (scaledWidth - width) / 2)
        const maxOffsetY = Math.max(0, (scaledHeight - height) / 2)

        // Calculate target position (with bounce effect)
        const targetX = Math.min(Math.max(translateX.value, -maxOffsetX), maxOffsetX)
        const targetY = Math.min(Math.max(translateY.value, -maxOffsetY), maxOffsetY)

        // If scale is less than or equal to 1, force center
        if (scale.value <= 1) {
          translateX.value = withSpring(0, {
            damping: 15,
            stiffness: 150,
          })
          translateY.value = withSpring(0, {
            damping: 15,
            stiffness: 150,
          })
          savedTranslateX.value = 0
          savedTranslateY.value = 0
        } else {
          translateX.value = withSpring(targetX, {
            damping: 15,
            stiffness: 150,
          })
          translateY.value = withSpring(targetY, {
            damping: 15,
            stiffness: 150,
          })
          savedTranslateX.value = targetX
          savedTranslateY.value = targetY
        }
      }
    })

  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .runOnJS(true)
    .onStart(() => {
      if (scale.value <= 1) {
        fadeOutCloseAnimation()
      }
    })

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart((e) => {
      if (scale.value !== 1) {
        // If current scale is not 1, reset to 1 and center
        scale.value = withSpring(1, {
          damping: 15,
          stiffness: 150,
        })
        savedScale.value = 1
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        })
        translateY.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        })
        savedTranslateX.value = 0
        savedTranslateY.value = 0
      } else {
        // If current scale is 1, zoom to 1.5x at double tap location
        const targetScale = 1.5
        scale.value = withSpring(targetScale, {
          damping: 15,
          stiffness: 150,
        })
        savedScale.value = targetScale

        // Calculate offset from double tap point to center

        const centerX = width / 2
        const centerY = height / 2

        // Calculate required offset to make double tap point the new center
        const targetX = (centerX - e.absoluteX) * targetScale
        const targetY = (centerY - e.absoluteY) * targetScale

        translateX.value = withSpring(targetX, {
          damping: 15,
          stiffness: 150,
        })
        translateY.value = withSpring(targetY, {
          damping: 15,
          stiffness: 150,
        })
        savedTranslateX.value = targetX
        savedTranslateY.value = targetY
      }
    })

  const composed = Gesture.Simultaneous(
    Gesture.Race(doubleTapGesture, panGesture, singleTapGesture),
    pinchGesture,
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }))

  // 更新动画样式
  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const overlayStyle = useAnimatedStyle(() => ({
    backgroundColor: "black",
    opacity: overlayOpacity.value,
  }))

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (!previewModalOpen) {
      timer = setTimeout(() => {
        resetValues()
      }, 300)
    }
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [previewModalOpen])

  const resetValues = () => {
    "worklet"
    layoutScale.value = 1
    layoutTransformX.value = 0
    layoutTransformY.value = 0
    scale.value = 1
    savedScale.value = 1
    translateX.value = 0
    translateY.value = 0
    savedTranslateX.value = 0
    savedTranslateY.value = 0
    opacity.value = 1
    isClosing.value = false
    overlayOpacity.value = 0
  }

  const fadeOutCloseAnimation = () => {
    scale.value = withSpring(2, gentleSpringPreset, (finished) => {
      if (finished) {
        runOnJS(setPreviewModalOpen)(false)
      }
    })
    opacity.value = withSpring(0, gentleSpringPreset)
    overlayOpacity.value = withSpring(0, gentleSpringPreset)
  }
  return (
    <>
      <Pressable
        onPress={() => {
          imageRef?.measureInWindow((pageX, pageY, w1, h1) => {
            setPreviewModalOpen(true)

            // 初始化 overlay 透明度
            overlayOpacity.value = 0
            requestAnimationFrame(() => {
              overlayOpacity.value = withSpring(0.9, gentleSpringPreset)
            })

            const { width: w2, height: screenHeight } = Dimensions.get("window")

            const scale = w2 / w1

            const x1 = pageX + w1 / 2
            const y1 = pageY + h1 / 2

            const x2 = w2 / 2
            const y2 = screenHeight / 2

            const xDelta = (x1 - x2) * scale
            const yDelta = (y1 - y2) * scale

            layoutScale.value = 1 / scale
            layoutTransformX.value = xDelta
            layoutTransformY.value = yDelta

            requestAnimationFrame(() => {
              layoutScale.value = withSpring(1, gentleSpringPreset)
              layoutTransformX.value = withSpring(0, gentleSpringPreset)
              layoutTransformY.value = withSpring(0, gentleSpringPreset)
            })
          })
        }}
      >
        <View ref={setImageRef}>
          <Image
            source={{ uri: imageUrl }}
            placeholder={{
              blurhash,
            }}
            className="w-full"
            style={{
              aspectRatio,
            }}
            placeholderContentFit="cover"
            recyclingKey={imageUrl}
          />
        </View>
      </Pressable>

      <Modal transparent visible={previewModalOpen}>
        <Animated.View style={overlayStyle} className="absolute inset-0" />
        <Animated.View style={modalStyle} className="w-full flex-1">
          <GestureHandlerRootView className="w-full flex-1">
            <View className="flex-1 items-center justify-center">
              <Pressable
                className="absolute right-2 top-safe-offset-2"
                onPress={fadeOutCloseAnimation}
              >
                <CloseCuteReIcon color="#fff" />
              </Pressable>
              <GestureDetector gesture={composed}>
                <Animated.View style={animatedStyle}>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          scale: layoutScale,
                        },
                        {
                          translateX: layoutTransformX,
                        },
                        {
                          translateY: layoutTransformY,
                        },
                      ],
                    }}
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      className="w-full"
                      style={{
                        aspectRatio,
                      }}
                      placeholder={{
                        blurhash,
                      }}
                    />
                  </Animated.View>
                </Animated.View>
              </GestureDetector>
            </View>
          </GestureHandlerRootView>
        </Animated.View>
      </Modal>
    </>
  )
}
