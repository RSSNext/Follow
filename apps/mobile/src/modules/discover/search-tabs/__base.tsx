import { cn } from "@follow/utils/src/utils"
import { forwardRef, useCallback, useState } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollViewProps } from "react-native"
import {
  RefreshControl,
  ScrollView,
  useAnimatedValue,
  useWindowDimensions,
  View,
} from "react-native"
import type { FlatListPropsWithLayout } from "react-native-reanimated"
import ReAnimated, { LinearTransition } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { CustomRefreshControl } from "@/src/components/common/RefreshControl"

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

  const [currentRefreshing, setCurrentRefreshing] = useState(refreshing)
  const nextRefreshing = currentRefreshing || refreshing

  const [pullProgress, setPullProgress] = useState(0)

  const scrollY = useAnimatedValue(0)

  const THRESHOLD = 180

  const handleRefresh = async () => {
    setCurrentRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setCurrentRefreshing(false)
    }
  }

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y
      if (offsetY < 0) {
        const progress = Math.abs(offsetY) / THRESHOLD
        setPullProgress(progress)
      } else {
        setPullProgress(0)
      }
      scrollY.setValue(offsetY)
    },
    [scrollY],
  )

  return (
    <>
      <ReAnimated.FlatList
        itemLayoutAnimation={LinearTransition}
        className="flex-1"
        style={{ width: windowWidth }}
        contentContainerStyle={{ paddingTop: offsetTop + 8 }}
        scrollIndicatorInsets={{ bottom: insets.bottom, top: offsetTop }}
        automaticallyAdjustContentInsets
        contentInsetAdjustmentBehavior="always"
        refreshControl={
          <View style={{ transform: [{ translateY: offsetTop }] }}>
            <CustomRefreshControl refreshing={nextRefreshing} pullProgress={pullProgress} />
            <RefreshControl
              tintColor="transparent"
              colors={["transparent"]}
              className="bg-transparent"
              refreshing={nextRefreshing}
              onRefresh={handleRefresh}
            />
          </View>
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        {...props}
      />
    </>
  )
}

const itemSeparator = (
  <View className="bg-opaque-separator ml-16 h-px" style={{ transform: [{ scaleY: 0.5 }] }} />
)
export const ItemSeparator = () => itemSeparator

export const RenderScrollComponent = (props: ScrollViewProps) => (
  <BaseSearchPageScrollView {...props} />
)
