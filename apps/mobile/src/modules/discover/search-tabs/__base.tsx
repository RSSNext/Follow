import { cn } from "@follow/utils/src/utils"
import { forwardRef } from "react"
import type { ScrollViewProps } from "react-native"
import { RefreshControl, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native"
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

export const BaseSearchPageRootView = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const windowWidth = useWindowDimensions().width

  const searchBarHeight = useSearchBarHeight()
  const offsetTop = searchBarHeight
  return (
    <View className={cn("flex-1", className)} style={{ paddingTop: offsetTop, width: windowWidth }}>
      {children}
    </View>
  )
}

export function BaseSearchPageFlatList<T>({
  refreshing,
  onRefresh,
  ...props
}: FlatListPropsWithLayout<T> & { refreshing: boolean; onRefresh: () => void }) {
  const insets = useSafeAreaInsets()
  const searchBarHeight = useSearchBarHeight()
  const offsetTop = searchBarHeight - insets.top
  const windowWidth = useWindowDimensions().width
  return (
    <Animated.FlatList
      itemLayoutAnimation={LinearTransition}
      className="flex-1"
      style={{ width: windowWidth }}
      contentContainerStyle={{ paddingTop: offsetTop + 8 }}
      scrollIndicatorInsets={{ bottom: insets.bottom, top: offsetTop }}
      automaticallyAdjustContentInsets
      contentInsetAdjustmentBehavior="always"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressViewOffset={searchBarHeight + insets.top}
        />
      }
      {...props}
    />
  )
}
const itemSeparator = (
  <View style={{ height: StyleSheet.hairlineWidth }} className="bg-opaque-separator ml-16 flex-1" />
)
export const ItemSeparator = () => itemSeparator

export const RenderScrollComponent = (props: ScrollViewProps) => (
  <BaseSearchPageScrollView {...props} />
)
