import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import type { FlashListProps } from "@shopify/flash-list"
import { FlashList } from "@shopify/flash-list"
import { forwardRef, useCallback, useContext } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { RefreshControl } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useColor } from "react-native-uikit-colors"

import { NavigationContext } from "@/src/components/common/SafeNavigationScrollView"
import { useHeaderHeight } from "@/src/modules/screen/hooks/useHeaderHeight"
import { debouncedFetchEntryContentByStream } from "@/src/store/entry/store"

type Props = {
  onRefresh: () => void
  isRefetching: boolean
}

export const TimelineSelectorList = forwardRef<FlashList<any>, Props & FlashListProps<any>>(
  ({ onRefresh, isRefetching, ...props }, ref) => {
    const insets = useSafeAreaInsets()

    const headerHeight = useHeaderHeight()
    const scrollY = useContext(NavigationContext)?.scrollY

    const onScroll = useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollY?.setValue(e.nativeEvent.contentOffset.y)
      },
      [scrollY],
    )

    const tabBarHeight = useBottomTabBarHeight()

    const systemFill = useColor("secondaryLabel")

    return (
      <FlashList
        ref={ref}
        refreshControl={
          <RefreshControl
            progressViewOffset={headerHeight}
            // // FIXME: not sure why we need set tintColor manually here, otherwise we can not see the refresh indicator
            tintColor={systemFill}
            onRefresh={onRefresh}
            refreshing={isRefetching}
          />
        }
        onScroll={onScroll}
        keyExtractor={(id) => id}
        onViewableItemsChanged={({ viewableItems }) => {
          debouncedFetchEntryContentByStream(viewableItems.map((item) => item.key))
        }}
        scrollIndicatorInsets={{
          top: headerHeight - insets.top,
          bottom: tabBarHeight ? tabBarHeight - insets.bottom : undefined,
        }}
        estimatedItemSize={100}
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: tabBarHeight,
        }}
        {...props}
      />
    )
  },
)
