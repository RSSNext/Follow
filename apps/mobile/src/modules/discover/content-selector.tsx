import { useAtomValue } from "jotai"
import { useEffect } from "react"
import { Animated, Easing, useAnimatedValue } from "react-native"

import { useDiscoverPageContext } from "./ctx"
import { Recommendations } from "./recommendations"

export const DiscoverContentSelector = () => {
  const isInSearch = useAtomValue(useDiscoverPageContext().searchFocusedAtom)

  const recommendationsOpacityValue = useAnimatedValue(1)

  useEffect(() => {
    if (isInSearch) {
      Animated.timing(recommendationsOpacityValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(recommendationsOpacityValue, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start()
    }
  }, [isInSearch, recommendationsOpacityValue])

  return (
    <Animated.View className={"flex-1"} style={{ opacity: recommendationsOpacityValue }}>
      <Recommendations />
    </Animated.View>
  )
}
