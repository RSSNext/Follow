import { useContext } from "react"
import { useAnimatedReaction } from "react-native-reanimated"

import { BottomTabBarBackgroundContext } from "@/src/components/layouts/tabbar/contexts/BottomTabBarBackgroundContext"
import { useBottomTabBarHeight } from "@/src/components/layouts/tabbar/hooks"

import { ScreenItemContext } from "../ScreenItemContext"

// FIXME
export const CalculateTabBarOpacity = () => {
  const { scrollViewContentHeight, scrollViewHeight, reAnimatedScrollY } =
    useContext(ScreenItemContext)
  const { opacity } = useContext(BottomTabBarBackgroundContext)
  const tabbarHeight = useBottomTabBarHeight()
  useAnimatedReaction(
    () => {
      // Calculate how close we are to the bottom of the content
      const distanceFromBottom =
        scrollViewContentHeight.value -
        scrollViewHeight.value -
        reAnimatedScrollY.value -
        tabbarHeight

      // Define a threshold for when to start fading (in pixels)
      const fadeThreshold = 50

      // If we're within the threshold distance from the bottom, calculate opacity
      if (distanceFromBottom <= fadeThreshold) {
        // Linear interpolation: 0 at bottom, 1 at threshold
        return Math.max(0, distanceFromBottom / fadeThreshold)
      }

      // Otherwise, keep the tab bar fully visible
      return 1
    },
    (opacityValue) => {
      opacity.value = opacityValue
    },
  )
  return null
}
