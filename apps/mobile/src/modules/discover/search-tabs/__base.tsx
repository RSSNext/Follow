import { forwardRef } from "react"
import type { ScrollViewProps } from "react-native"
import { ScrollView, useWindowDimensions, View } from "react-native"
import type { FlatListPropsWithLayout } from "react-native-reanimated"
import Animated, { LinearTransition } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useSearchBarHeight } from "../ctx"

export const BaseSearchPageScrollView = forwardRef<ScrollView, ScrollViewProps>(
  ({ children, ...props }, ref) => {
    const searchBarHeight = useSearchBarHeight()
    const insets = useSafeAreaInsets()
    const windowWidth = useWindowDimensions().width
    const offsetTop = searchBarHeight - insets.top
    return (
      <ScrollView
        ref={ref}
        style={{ paddingTop: offsetTop, width: windowWidth }}
        automaticallyAdjustContentInsets
        contentInsetAdjustmentBehavior="always"
        className="flex-1"
        scrollIndicatorInsets={{ bottom: insets.bottom, top: offsetTop }}
        {...props}
      >
        {children}
      </ScrollView>
    )
  },
)

export const BaseSearchPageRootView = ({ children }: { children: React.ReactNode }) => {
  const windowWidth = useWindowDimensions().width
  const insets = useSafeAreaInsets()
  const searchBarHeight = useSearchBarHeight()
  const offsetTop = searchBarHeight - insets.top
  return (
    <View className="flex-1" style={{ paddingTop: offsetTop, width: windowWidth }}>
      {children}
    </View>
  )
}

export function BaseSearchPageFlatList<T>({ ...props }: FlatListPropsWithLayout<T>) {
  const insets = useSafeAreaInsets()
  const searchBarHeight = useSearchBarHeight()
  const offsetTop = searchBarHeight - insets.top
  const windowWidth = useWindowDimensions().width
  return (
    <Animated.FlatList
      itemLayoutAnimation={LinearTransition}
      className="flex-1"
      style={{ width: windowWidth }}
      contentContainerStyle={{ paddingTop: offsetTop }}
      scrollIndicatorInsets={{ bottom: insets.bottom, top: offsetTop }}
      automaticallyAdjustContentInsets
      contentInsetAdjustmentBehavior="always"
      {...props}
    />
  )
}
