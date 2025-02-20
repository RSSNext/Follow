import type { FlashListProps, MasonryFlashListProps } from "@shopify/flash-list"
import { FlashList, MasonryFlashList } from "@shopify/flash-list"
import { forwardRef, useCallback, useContext } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { RefreshControl } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useColor } from "react-native-uikit-colors"

import { NavigationContext } from "@/src/components/common/SafeNavigationScrollView"
import { useBottomTabBarHeight } from "@/src/components/ui/tabbar/hooks"
import { useHeaderHeight } from "@/src/modules/screen/hooks/useHeaderHeight"
import { usePrefetchSubscription } from "@/src/store/subscription/hooks"
import { usePrefetchUnread } from "@/src/store/unread/hooks"

type Props = {
  onRefresh: () => void
  isRefetching: boolean
}

export const TimelineSelectorList = forwardRef<
  FlashList<any>,
  Props & Omit<FlashListProps<any>, "onRefresh">
>(({ onRefresh, isRefetching, ...props }, ref) => {
  const { refetch: unreadRefetch } = usePrefetchUnread()
  const { refetch: subscriptionRefetch } = usePrefetchSubscription()

  const insets = useSafeAreaInsets()

  const headerHeight = useHeaderHeight()
  const { scrollY } = useContext(NavigationContext)!

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      props.onScroll?.(e)

      scrollY?.setValue(e.nativeEvent.contentOffset.y)
    },
    [scrollY, props.onScroll],
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
          onRefresh={() => {
            unreadRefetch()
            subscriptionRefetch()
            onRefresh()
          }}
          refreshing={isRefetching}
        />
      }
      scrollIndicatorInsets={{
        top: headerHeight - insets.top,
        bottom: tabBarHeight ? tabBarHeight - insets.bottom : undefined,
      }}
      contentContainerStyle={{
        paddingTop: headerHeight,
        paddingBottom: tabBarHeight,
      }}
      {...props}
      onScroll={onScroll}
    />
  )
})

export const TimelineSelectorMasonryList = ({
  onRefresh,
  isRefetching,
  ...props
}: Props & Omit<MasonryFlashListProps<any>, "onRefresh">) => {
  const { refetch: unreadRefetch } = usePrefetchUnread()
  const { refetch: subscriptionRefetch } = usePrefetchSubscription()

  const insets = useSafeAreaInsets()

  const headerHeight = useHeaderHeight()
  const scrollY = useContext(NavigationContext)?.scrollY

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      props.onScroll?.(e)
      scrollY?.setValue(e.nativeEvent.contentOffset.y)
    },
    [scrollY, props.onScroll],
  )

  const tabBarHeight = useBottomTabBarHeight()

  const systemFill = useColor("secondaryLabel")

  return (
    <MasonryFlashList
      refreshControl={
        <RefreshControl
          progressViewOffset={headerHeight}
          // // FIXME: not sure why we need set tintColor manually here, otherwise we can not see the refresh indicator
          tintColor={systemFill}
          onRefresh={() => {
            unreadRefetch()
            subscriptionRefetch()
            onRefresh()
          }}
          refreshing={isRefetching}
        />
      }
      scrollIndicatorInsets={{
        top: headerHeight - insets.top,
        bottom: tabBarHeight ? tabBarHeight - insets.bottom : undefined,
      }}
      contentContainerStyle={{
        paddingTop: headerHeight,
        paddingBottom: tabBarHeight,
      }}
      {...props}
      onScroll={onScroll}
    />
  )
}
