import { useTypeScriptHappyCallback } from "@follow/hooks/exports"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Stack } from "expo-router"
import type { FC } from "react"
import { memo } from "react"
import { StyleSheet, View } from "react-native"
import type { SharedValue } from "react-native-reanimated"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"
import { useColor } from "react-native-uikit-colors"

import { HeaderTitleExtra } from "../../common/HeaderTitleExtra"
import { ModalHeaderCloseButton } from "../../common/ModalSharedComponents"
import { ThemedBlurView } from "../../common/ThemedBlurView"
import { useModalScrollViewContext } from "../contexts/ModalScrollViewContext"
import { getDefaultHeaderHeight } from "../utils"

interface ModalHeaderProps
  extends Omit<NativeStackNavigationOptions, "headerLeft" | "headerRight" | "headerTitle"> {
  headerLeft?: React.ReactNode
  headerRight?: React.ReactNode
  headerTitle?: string
  headerSubtitle?: string
}

export const ModalHeader: FC<ModalHeaderProps> = (props) => {
  const { animatedY } = useModalScrollViewContext()

  return (
    <Stack.Screen
      options={{
        ...props,
        headerTransparent: true,
        headerShown: true,
        headerLeft: () => props.headerLeft ?? <ModalHeaderCloseButton />,
        headerRight: () => props.headerRight,

        header: useTypeScriptHappyCallback(
          ({ options }) => (
            <Header
              headerTitle={props.headerTitle}
              headerLeft={options.headerLeft?.({} as any)}
              headerRight={options.headerRight?.({} as any)}
              animatedY={animatedY}
              headerSubtitle={props.headerSubtitle}
            />
          ),
          [animatedY, props.headerSubtitle, props.headerTitle],
        ),
      }}
    />
  )
}

interface HeaderProps {
  headerTitle?: string
  headerLeft?: React.ReactNode
  headerRight?: React.ReactNode
  animatedY: SharedValue<number>
  headerSubtitle?: string
}

const InternalBlurEffectWithBottomBorder = (props: { animatedY: SharedValue<number> }) => {
  const border = useColor("opaqueSeparator")
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: Math.max(0, Math.min(1, props.animatedY.value / 10)),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: border,
    }
  })
  return (
    <Animated.View className={"absolute inset-0 overflow-hidden"} style={animatedStyle}>
      <ThemedBlurView style={StyleSheet.absoluteFillObject} />
    </Animated.View>
  )
}

const Header: FC<HeaderProps> = memo(
  ({ headerTitle, headerLeft, headerRight, headerSubtitle, animatedY }) => {
    const frame = useSafeAreaFrame()
    const insets = useSafeAreaInsets()
    const height = getDefaultHeaderHeight(frame, true, insets.top)

    return (
      <View style={{ height }} className="items-center justify-center">
        <InternalBlurEffectWithBottomBorder animatedY={animatedY} />
        {/* Grid */}
        <View className="mx-5 flex-row items-center">
          {/* Left actions */}
          <View className="flex-1 flex-row items-center justify-start gap-2">{headerLeft}</View>

          {/* Title */}
          <View className="mx-8 flex-row items-center justify-center text-center">
            {/* <Text>Title</Text> */}
            <HeaderTitleExtra subText={headerSubtitle}>{headerTitle}</HeaderTitleExtra>
          </View>

          {/* Right actions */}
          <View className="flex-1 flex-row items-center justify-end gap-2">{headerRight}</View>
        </View>
      </View>
    )
  },
)
