import { useMemo } from "react"
import type { ScrollView } from "react-native"
import { View } from "react-native"
import type { AnimatedScrollViewProps } from "react-native-reanimated"
import { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"

import { ReAnimatedScrollView } from "../../common/AnimatedComponents"
import { ModalScrollViewContext } from "../contexts/ModalScrollViewContext"
import { getDefaultHeaderHeight } from "../utils"

interface SafeModalScrollViewProps extends AnimatedScrollViewProps {}
export const SafeModalScrollView = (props: SafeModalScrollViewProps) => {
  const frame = useSafeAreaFrame()
  const insets = useSafeAreaInsets()
  const headerHeight = getDefaultHeaderHeight(frame, true, insets.top)
  const animatedY = useSharedValue(0)
  const animatedRef = useAnimatedRef<ScrollView>()
  return (
    <View className="flex-1">
      <ModalScrollViewContext.Provider
        value={useMemo(() => ({ scrollViewRef: animatedRef, animatedY }), [animatedRef, animatedY])}
      >
        <ReAnimatedScrollView
          {...props}
          ref={animatedRef}
          onScroll={useAnimatedScrollHandler({
            onScroll: (e) => {
              animatedY.value = e.contentOffset.y
            },
          })}
          scrollEventThrottle={16}
          scrollIndicatorInsets={{ top: headerHeight, bottom: insets.bottom }}
          contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: insets.bottom }}
        >
          {props.children}
        </ReAnimatedScrollView>
      </ModalScrollViewContext.Provider>
    </View>
  )
}
