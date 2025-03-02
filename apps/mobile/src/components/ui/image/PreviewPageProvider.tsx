import { Image } from "expo-image"
import type { RefObject } from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { Dimensions, Modal, Pressable, useWindowDimensions, View } from "react-native"
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { useEventCallback } from "usehooks-ts"

import { gentleSpringPreset } from "@/src/constants/spring"
import { CloseCuteReIcon } from "@/src/icons/close_cute_re"

import { PortalHost } from "../portal"
import { ImageContextMenu } from "./ImageContextMenu"

interface PreviewImageProps {
  imageUrl: string
  blurhash?: string | undefined
  aspectRatio: number
  recyclingKey?: string
}

interface OpenPreviewParams {
  imageRef: RefObject<View>
  images: PreviewImageProps[]
  initialIndex?: number
  accessoriesElement?: React.ReactNode
}

interface PreviewImageContextType {
  openPreview: (params: OpenPreviewParams) => void
}
const PreviewImageContext = createContext<PreviewImageContextType | null>(null)

export const usePreviewImage = () => {
  const context = useContext(PreviewImageContext)
  if (!context) {
    throw new Error("usePreviewImage must be used within PreviewImageProvider")
  }
  return context
}

export const PreviewImageProvider = ({ children }: { children: React.ReactNode }) => {
  const { width, height } = useWindowDimensions()
  const [previewModalOpen, setPreviewModalOpen] = useState(false)

  const [currentState, setCurrentState] = useState<PreviewImageProps[] | null>(null)
  const [imageRef, setImageRef] = useState<View | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [accessoriesElement, setAccessoriesElement] = useState<React.ReactNode | null>(null)
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
  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
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
        }),
    [pinchCenter, savedScale, scale],
  )

  // Animation closing state
  const isClosing = useSharedValue(false)

  // Animation opacity value
  const opacity = useSharedValue(1)

  // Overlay opacity animation value
  const overlayOpacity = useSharedValue(0)

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
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
          if (!currentState) return
          if (!currentState[currentIndex]) return
          const { aspectRatio } = currentState[currentIndex]
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
            // Handle horizontal swipe
            if (e.translationX < -50 && currentIndex < currentState.length - 1) {
              setCurrentIndex((prevIndex) => prevIndex + 1)
            } else if (e.translationX > 50 && currentIndex > 0) {
              setCurrentIndex((prevIndex) => prevIndex - 1)
            }
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
              translateX.value = withSpring(0, gentleSpringPreset)
              translateY.value = withSpring(0, gentleSpringPreset)
              savedTranslateX.value = 0
              savedTranslateY.value = 0
            } else {
              translateX.value = withSpring(targetX, gentleSpringPreset)
              translateY.value = withSpring(targetY, gentleSpringPreset)
              savedTranslateX.value = targetX
              savedTranslateY.value = targetY
            }
          }
        }),
    [
      currentState,
      currentIndex,
      height,
      imageRef,
      isClosing,
      layoutScale,
      layoutTransformX,
      layoutTransformY,
      opacity,
      overlayOpacity,
      savedTranslateX,
      savedTranslateY,
      scale,
      translateX,
      translateY,
      width,
    ],
  )

  const fadeOutCloseAnimation = useEventCallback(() => {
    scale.value = withSpring(1.2, gentleSpringPreset, (finished) => {
      if (finished) {
        runOnJS(setPreviewModalOpen)(false)
      }
    })
    opacity.value = withSpring(0, gentleSpringPreset)
    overlayOpacity.value = withSpring(0, gentleSpringPreset)
  })
  const doubleTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(2)
        .onStart((e) => {
          if (scale.value !== 1) {
            // If current scale is not 1, reset to 1 and center
            scale.value = withSpring(1, gentleSpringPreset)
            savedScale.value = 1
            translateX.value = withSpring(0, gentleSpringPreset)
            translateY.value = withSpring(0, gentleSpringPreset)
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

            translateX.value = withSpring(targetX, gentleSpringPreset)
            translateY.value = withSpring(targetY, gentleSpringPreset)
            savedTranslateX.value = targetX
            savedTranslateY.value = targetY
          }
        }),
    [height, savedScale, savedTranslateX, savedTranslateY, scale, translateX, translateY, width],
  )
  const singleTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(1)
        .runOnJS(true)
        .onStart(() => {
          fadeOutCloseAnimation()
        })
        .requireExternalGestureToFail(pinchGesture, doubleTapGesture),
    [doubleTapGesture, fadeOutCloseAnimation, pinchGesture],
  )

  const composed = useMemo(
    () =>
      Gesture.Simultaneous(
        Gesture.Race(doubleTapGesture, panGesture, singleTapGesture),
        pinchGesture,
      ),
    [doubleTapGesture, panGesture, pinchGesture, singleTapGesture],
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }))

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
    opacity.value = 0
    isClosing.value = false
    overlayOpacity.value = 0
  }

  const openPreview = useCallback(
    (params: OpenPreviewParams) => {
      setCurrentState(params.images)
      setCurrentIndex(params.initialIndex || 0)
      setImageRef(params.imageRef.current)
      setAccessoriesElement(params.accessoriesElement)
      params.imageRef.current?.measureInWindow((pageX, pageY, w1, h1) => {
        setPreviewModalOpen(true)

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
          opacity.value = withSpring(1)
        })
      })
    },
    [layoutScale, layoutTransformX, layoutTransformY, opacity, overlayOpacity],
  )
  const ctxValue = useMemo(() => ({ openPreview }), [openPreview])
  return (
    <PreviewImageContext.Provider value={ctxValue}>
      {children}
      {currentState && (
        <Modal transparent visible={previewModalOpen}>
          <PortalHost>
            <Animated.View style={overlayStyle} className="absolute inset-0" />
            <Animated.View style={modalStyle} className="w-full flex-1">
              <GestureHandlerRootView className="w-full flex-1">
                <View className="flex-1 items-center justify-center">
                  <Pressable
                    className="top-safe-offset-2 absolute right-2"
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
                        <ImageContextMenu imageUrl={currentState[currentIndex]?.imageUrl}>
                          <Image
                            recyclingKey={currentState[currentIndex]?.recyclingKey}
                            source={{ uri: currentState[currentIndex]?.imageUrl }}
                            className="w-full"
                            style={{
                              aspectRatio: currentState[currentIndex]?.aspectRatio,
                            }}
                            placeholder={{
                              blurhash: currentState[currentIndex]?.blurhash,
                            }}
                          />
                        </ImageContextMenu>
                      </Animated.View>
                    </Animated.View>
                  </GestureDetector>
                </View>
              </GestureHandlerRootView>
              {accessoriesElement}
            </Animated.View>
          </PortalHost>
        </Modal>
      )}
    </PreviewImageContext.Provider>
  )
}
