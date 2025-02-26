import { useTypeScriptHappyCallback } from "@follow/hooks"
import { getDefaultHeaderHeight } from "@react-navigation/elements"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { router, Stack, useNavigation } from "expo-router"
import type { FC, PropsWithChildren } from "react"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import type { ScrollView, ScrollViewProps } from "react-native"
import { Animated as RNAnimated, TouchableOpacity, useAnimatedValue, View } from "react-native"
import type { ReanimatedScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"
import { useColor } from "react-native-uikit-colors"

import {
  AttachNavigationScrollViewContext,
  SetAttachNavigationScrollViewContext,
} from "@/src/components/layouts/tabbar/contexts/AttachNavigationScrollViewContext"
import { useBottomTabBarHeight } from "@/src/components/layouts/tabbar/hooks"
import { MingcuteLeftLineIcon } from "@/src/icons/mingcute_left_line"

import { AnimatedScrollView } from "../../common/AnimatedComponents"
import { NavigationHeader } from "../header/NavigationHeader"
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
} & PropsWithChildren

export const SafeNavigationScrollView: FC<SafeNavigationScrollViewProps> = ({
  children,

  withHeaderBlur = true,
  onScroll,

  withBottomInset = false,
  withTopInset = false,

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
            })}
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
  ...props
}: NativeStackNavigationOptions & {
  blurThreshold?: number
  headerHideableBottomHeight?: number
  headerHideableBottom?: () => React.ReactNode
}) => {
  const label = useColor("label")

  const canBack = useNavigation().canGoBack()

  const navigationContext = useContext(NavigationContext)!

  const setHeaderHeight = useContext(SetNavigationHeaderHeightContext)

  const hideableBottom = headerHideableBottom?.()
  const { headerLeft, ...rest } = props

  return (
    <Stack.Screen
      options={{
        headerTransparent: true,

        headerShown: true,
        headerLeft:
          headerLeft ??
          (canBack
            ? () => (
                <TouchableOpacity hitSlop={10} onPress={() => router.back()}>
                  <MingcuteLeftLineIcon height={20} width={20} color={label} />
                </TouchableOpacity>
              )
            : undefined),

        header: useTypeScriptHappyCallback(
          ({ options }) => (
            <NavigationContext.Provider value={navigationContext}>
              <SetNavigationHeaderHeightContext.Provider value={setHeaderHeight}>
                <NavigationHeader
                  modal={options.presentation === "modal" || options.presentation === "formSheet"}
                  title={options.title}
                  headerRight={options.headerRight}
                  headerLeft={options.headerLeft}
                  hideableBottom={hideableBottom}
                  hideableBottomHeight={headerHideableBottomHeight}
                  // @ts-expect-error
                  headerTitle={options.headerTitle}
                />
              </SetNavigationHeaderHeightContext.Provider>
            </NavigationContext.Provider>
          ),
          [hideableBottom, navigationContext],
        ),

        ...rest,
      }}
    />
  )
}
