import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { router, Stack, useNavigation } from "expo-router"
import type { FC } from "react"
import type { ScrollViewProps } from "react-native"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useColor } from "react-native-uikit-colors"

import { MingcuteLeftLineIcon } from "@/src/icons/mingcute_left_line"

import { BlurEffectWithBottomBorder } from "./BlurEffect"

type SafeNavigationScrollViewProps = ScrollViewProps & {
  withHeaderBlur?: boolean
}

export const SafeNavigationScrollView: FC<SafeNavigationScrollViewProps> = ({
  children,

  withHeaderBlur = true,
  ...props
}) => {
  const insets = useSafeAreaInsets()
  const tabBarHeight = useBottomTabBarHeight()
  const headerHeight = useHeaderHeight()

  return (
    <>
      {withHeaderBlur && <NavigationBlurEffectHeader />}
      <ScrollView contentInsetAdjustmentBehavior="automatic" {...props}>
        <View style={{ height: headerHeight - insets.top }} />
        <View>{children}</View>
        <View style={{ height: tabBarHeight - insets.bottom }} />
      </ScrollView>
    </>
  )
}

export interface NavigationBlurEffectHeaderProps {
  title?: string
}
export const NavigationBlurEffectHeader = (props: NavigationBlurEffectHeaderProps) => {
  const label = useColor("label")

  const canBack = useNavigation().canGoBack()

  return (
    <Stack.Screen
      options={{
        headerBackground: BlurEffectWithBottomBorder,
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
