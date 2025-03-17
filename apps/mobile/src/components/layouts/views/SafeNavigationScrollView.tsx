import { useTypeScriptHappyCallback } from "@follow/hooks"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import type { FC, PropsWithChildren } from "react"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
} from "react-native"
import { Animated as RNAnimated, useAnimatedValue, View } from "react-native"
import type { SharedValue } from "react-native-reanimated"
import type { ReanimatedScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"

import {
  AttachNavigationScrollViewContext,
  SetAttachNavigationScrollViewContext,
} from "@/src/components/layouts/tabbar/contexts/AttachNavigationScrollViewContext"
import { useBottomTabBarHeight } from "@/src/components/layouts/tabbar/hooks"

import { AnimatedScrollView } from "../../common/AnimatedComponents"
import { Portal } from "../../ui/portal"
import type { InternalNavigationHeaderProps } from "../header/NavigationHeader"
import { InternalNavigationHeader } from "../header/NavigationHeader"
import { getDefaultHeaderHeight } from "../utils"
import { NavigationContext } from "./NavigationContext"
import {
  NavigationHeaderHeightContext,
  SetNavigationHeaderHeightContext,
} from "./NavigationHeaderContext"

type SafeNavigationScrollViewProps = Omit<ScrollViewProps, "onScroll"> & {
  withHeaderBlur?: boolean
  onScroll?: (e: ReanimatedScrollEvent) => void

  // For scroll view content adjustment behavior
  withTopInset?: boolean
  withBottomInset?: boolean

  // to sharedValue
  reanimatedScrollY?: SharedValue<number>
} & PropsWithChildren

export const SafeNavigationScrollView: FC<SafeNavigationScrollViewProps> = ({
  children,

  withHeaderBlur = true,
  onScroll,

  withBottomInset = false,
  withTopInset = false,
  reanimatedScrollY,

  ...props
}) => {
  const insets = useSafeAreaInsets()
  const tabBarHeight = useBottomTabBarHeight()

  const scrollY = useAnimatedValue(0)
  const scrollViewRef = useRef<ScrollView>(null)

  const setAttachNavigationScrollViewRef = useContext(SetAttachNavigationScrollViewContext)
  useEffect(() => {
    if (setAttachNavigationScrollViewRef) {
      setAttachNavigationScrollViewRef(scrollViewRef)
    }
  }, [setAttachNavigationScrollViewRef, scrollViewRef])

  const frame = useSafeAreaFrame()
  const [headerHeight, setHeaderHeight] = useState(() =>
    getDefaultHeaderHeight(frame, false, insets.top),
  )

  return (
    <NavigationContext.Provider value={useMemo(() => ({ scrollY }), [scrollY])}>
      <NavigationHeaderHeightContext.Provider value={headerHeight}>
        <SetNavigationHeaderHeightContext.Provider value={setHeaderHeight}>
          {withHeaderBlur && <NavigationBlurEffectHeader />}
          <AnimatedScrollView
            ref={scrollViewRef}
            onScroll={RNAnimated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
              useNativeDriver: true,
              listener(event: NativeSyntheticEvent<NativeScrollEvent>) {
                if (reanimatedScrollY) {
                  reanimatedScrollY.value = event.nativeEvent.contentOffset.y
                }
              },
            })}
            automaticallyAdjustContentInsets={false}
            automaticallyAdjustsScrollIndicatorInsets={false}
            scrollIndicatorInsets={{
              top: headerHeight,
              bottom: tabBarHeight,
            }}
            {...props}
          >
            <View style={{ height: headerHeight - (withTopInset ? insets.top : 0) }} />
            <AttachNavigationScrollViewContext.Provider value={scrollViewRef}>
              <View>{children}</View>
            </AttachNavigationScrollViewContext.Provider>
            <View style={{ height: tabBarHeight - (withBottomInset ? insets.bottom : 0) }} />
          </AnimatedScrollView>
        </SetNavigationHeaderHeightContext.Provider>
      </NavigationHeaderHeightContext.Provider>
    </NavigationContext.Provider>
  )
}

export const NavigationBlurEffectHeader = ({
  headerHideableBottom,
  headerHideableBottomHeight,
  headerTitleAbsolute,
  ...props
}: InternalNavigationHeaderProps & {
  blurThreshold?: number
  headerHideableBottomHeight?: number
  headerHideableBottom?: () => React.ReactNode
  headerTitleAbsolute?: boolean
}) => {
  const setHeaderHeight = useContext(SetNavigationHeaderHeightContext)

  const hideableBottom = headerHideableBottom?.()

  return (
    <Portal>
      <SetNavigationHeaderHeightContext.Provider value={setHeaderHeight}>
        <InternalNavigationHeader
          title={props.title}
          headerRight={props.headerRight}
          headerLeft={props.headerLeft}
          hideableBottom={hideableBottom}
          hideableBottomHeight={headerHideableBottomHeight}
          headerTitleAbsolute={headerTitleAbsolute}
        />
      </SetNavigationHeaderHeightContext.Provider>
    </Portal>
  )
  // return (
  //   <Stack.Screen
  //     options={{
  //       headerTransparent: true,

  //       headerShown: true,
  //       headerLeft,

  //       header: useTypeScriptHappyCallback(
  //         ({ options }) => (
  //           <NavigationContext.Provider value={navigationContext}>
  //             <SetNavigationHeaderHeightContext.Provider value={setHeaderHeight}>
  //               <InternalNavigationHeader
  //                 {...options}
  //                 modal={options.presentation === "modal" || options.presentation === "formSheet"}
  //                 title={options.title}
  //                 headerRight={options.headerRight}
  //                 headerLeft={options.headerLeft}
  //                 hideableBottom={hideableBottom}
  //                 hideableBottomHeight={headerHideableBottomHeight}
  //                 headerTitleAbsolute={headerTitleAbsolute}
  //                 // @ts-expect-error
  //                 headerTitle={options.headerTitle}
  //               />
  //             </SetNavigationHeaderHeightContext.Provider>
  //           </NavigationContext.Provider>
  //         ),
  //         [hideableBottom, navigationContext],
  //       ),

  //       ...rest,
  //     }}
  //   />
  // )
}
