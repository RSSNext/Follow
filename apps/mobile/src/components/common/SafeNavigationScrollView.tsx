import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { router, Stack, useNavigation } from "expo-router"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { ScrollViewProps } from "react-native"
import {
  Animated as RNAnimated,
  StyleSheet,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native"
import type { ReanimatedScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useColor } from "react-native-uikit-colors"

import { MingcuteLeftLineIcon } from "@/src/icons/mingcute_left_line"

import { AnimatedScrollView } from "./AnimatedComponents"
import { ThemedBlurView } from "./ThemedBlurView"

type SafeNavigationScrollViewProps = Omit<ScrollViewProps, "onScroll"> & {
  withHeaderBlur?: boolean
  onScroll?: (e: ReanimatedScrollEvent) => void

  // For scroll view content adjustment behavior
  withTopInset?: boolean
  withBottomInset?: boolean
} & PropsWithChildren
const NavigationContext = createContext<{
  scrollY: RNAnimated.Value
} | null>(null)

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
  const headerHeight = useHeaderHeight()

  const scrollY = useAnimatedValue(0)

  return (
    <NavigationContext.Provider value={useMemo(() => ({ scrollY }), [scrollY])}>
      {withHeaderBlur && <NavigationBlurEffectHeader />}
      <AnimatedScrollView
        onScroll={RNAnimated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        {...props}
      >
        <View style={{ height: headerHeight - (withTopInset ? insets.top : 0) }} />
        <View>{children}</View>
        <View style={{ height: tabBarHeight - (withBottomInset ? insets.bottom : 0) }} />
      </AnimatedScrollView>
    </NavigationContext.Provider>
  )
}

export interface NavigationBlurEffectHeaderProps {
  title?: string
}
export const NavigationBlurEffectHeader = (props: NavigationBlurEffectHeaderProps) => {
  const label = useColor("label")

  const canBack = useNavigation().canGoBack()

  const { scrollY } = useContext(NavigationContext)!

  const border = useColor("opaqueSeparator")

  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const id = scrollY.addListener(({ value }) => {
      setOpacity(Math.min(1, Math.max(0, Math.min(1, value / 10))))
    })

    return () => {
      scrollY.removeListener(id)
    }
  }, [scrollY])

  return (
    <Stack.Screen
      options={{
        headerBackground: () => (
          <ThemedBlurView
            style={{
              ...StyleSheet.absoluteFillObject,
              opacity,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: border,
            }}
          />
        ),
        headerTransparent: true,

        headerLeft: canBack
          ? () => (
              <TouchableOpacity hitSlop={10} onPress={() => router.back()}>
                <MingcuteLeftLineIcon height={20} width={20} color={label} />
              </TouchableOpacity>
            )
          : undefined,
        title: props.title,
      }}
    />
  )
}
