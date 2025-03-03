import type {
  FlashListProps,
  MasonryFlashListProps,
  MasonryFlashListRef,
} from "@shopify/flash-list"
import { FlashList, MasonryFlashList } from "@shopify/flash-list"
import type { ElementRef, RefObject } from "react"
import { forwardRef, useCallback, useContext } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { RefreshControl } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useColor } from "react-native-uikit-colors"

import { useBottomTabBarHeight } from "@/src/components/layouts/tabbar/hooks"
import { NavigationContext } from "@/src/components/layouts/views/NavigationContext"
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

  // const listRef = useRef<FlashList<any>>(null)

  // useImperativeHandle(ref, () => listRef.current!)

  return (
    <FlashList
      automaticallyAdjustsScrollIndicatorInsets={false}
      automaticallyAdjustContentInsets={false}
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
        top: headerHeight,
        bottom: tabBarHeight,
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

export const TimelineSelectorMasonryList = forwardRef<
  ElementRef<typeof MasonryFlashList>,
  Props & Omit<MasonryFlashListProps<any>, "onRefresh">
>(({ onRefresh, isRefetching, ...props }, ref) => {
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
      ref={ref as RefObject<MasonryFlashListRef<any>>}
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
