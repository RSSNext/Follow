import type { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { TabBarIcon } from "@react-navigation/bottom-tabs/src/views/TabBarIcon"
import { getLabel } from "@react-navigation/elements"
import {
  CommonActions,
  NavigationContext,
  NavigationRouteContext,
  useTheme,
} from "@react-navigation/native"
import type { FC } from "react"
import { useContext, useEffect } from "react"
import type { StyleProp, ViewStyle } from "react-native"
import { Platform, Pressable, StyleSheet, Text } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { SetBottomTabBarHeightContext } from "@/src/components/ui/tabbar/context"
import { quickSpringPreset, softSpringPreset } from "@/src/constants/spring"
import { accentColor, useColor } from "@/src/theme/colors"

import { ThemedBlurView } from "../../common/ThemedBlurView"
import { Grid } from "../grid"
import { BottomTabBarBackgroundContext } from "./BottomTabBarBackgroundContext"
import { BottomTabBarVisibleContext } from "./BottomTabBarVisibleContext"

export const Tabbar: FC<BottomTabBarProps> = (props) => {
  const { state, navigation, descriptors } = props
  const { routes } = state
  const setTabBarHeight = useContext(SetBottomTabBarHeightContext)
  const { fonts } = useTheme()

  const insets = useSafeAreaInsets()
  const tabBarVisible = useContext(BottomTabBarVisibleContext)

  const translateY = useSharedValue(0)
  useEffect(() => {
    translateY.value = withSpring(
      tabBarVisible ? 0 : 100,
      !tabBarVisible ? quickSpringPreset : softSpringPreset,
    )
  }, [tabBarVisible, translateY])
  return (
    <Animated.View
      accessibilityRole="tablist"
      className="absolute inset-x-0 bottom-0 z-10 flex-row py-[7]"
      style={{
        paddingBottom: insets.bottom,
        transform: [{ translateY }],
      }}
      onLayout={(e) => {
        setTabBarHeight(e.nativeEvent.layout.height)
      }}
    >
      <TabBarBackground />
      <Grid columns={routes.length} gap={10}>
        {routes.map((route, index) => {
          const focused = index === state.index
          const { options } = descriptors[route.key]!

          const inactiveTintColor = "#999"
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })

            if (!focused && !event.defaultPrevented) {
              navigation.dispatch({
                ...CommonActions.navigate(route),
                target: state.key,
              })
            }
          }
          const label =
            typeof options?.tabBarLabel === "function"
              ? options?.tabBarLabel
              : getLabel({ label: options?.tabBarLabel, title: options?.title }, route.name)

          const accessibilityLabel =
            options?.tabBarAccessibilityLabel !== undefined
              ? options?.tabBarAccessibilityLabel
              : typeof label === "string" && Platform.OS === "ios"
                ? `${label}, tab, ${index + 1} of ${routes.length}`
                : undefined

          const renderIcon = ({ focused }: { focused: boolean }) => {
            const activeOpacity = focused ? 1 : 0
            const inactiveOpacity = focused ? 0 : 1

            return (
              <TabBarIcon
                route={route}
                variant={"uikit"}
                size={"regular"}
                badge={undefined}
                badgeStyle={undefined}
                activeOpacity={activeOpacity}
                allowFontScaling={true}
                inactiveOpacity={inactiveOpacity}
                activeTintColor={accentColor}
                inactiveTintColor={inactiveTintColor}
                renderIcon={options.tabBarIcon!}
                style={options.tabBarIconStyle as StyleProp<ViewStyle>}
              />
            )
          }

          const renderLabel = ({ focused }: { focused: boolean }) => {
            const color = focused ? accentColor : accentColor

            if (typeof label !== "string") {
              const labelString = getLabel(
                {
                  label: typeof options?.tabBarLabel === "string" ? options.tabBarLabel : undefined,
                  title: options?.title,
                },
                route.name,
              )

              return label({
                focused,
                color,
                position: "beside-icon",
                children: labelString,
              })
            }

            return (
              <Text
                numberOfLines={1}
                accessibilityLabel={accessibilityLabel}
                style={StyleSheet.flatten([
                  styles.labelBeneath,
                  fonts.regular,
                  {
                    color: focused ? accentColor : inactiveTintColor,
                  },
                ])}
                allowFontScaling
              >
                {label}
              </Text>
            )
          }
          const scene = { route, focused }
          return (
            <NavigationContext.Provider key={route.key} value={descriptors[route.key]?.navigation}>
              <NavigationRouteContext.Provider value={route}>
                <Pressable
                  onPress={onPress}
                  className="flex-1 flex-col items-center justify-center"
                >
                  {renderIcon(scene)}
                  {renderLabel(scene)}
                </Pressable>
              </NavigationRouteContext.Provider>
            </NavigationContext.Provider>
          )
        })}
      </Grid>
    </Animated.View>
  )
}
const styles = StyleSheet.create({
  labelBeneath: {
    fontSize: 10,
  },
  blurEffect: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    backgroundColor: "transparent",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
})

const AnimatedThemedBlurView = Animated.createAnimatedComponent(ThemedBlurView)
const TabBarBackground = () => {
  const { opacity } = useContext(BottomTabBarBackgroundContext)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    ...styles.blurEffect,
  }))
  const borderColor = useColor("opaqueSeparator")
  return <AnimatedThemedBlurView style={[styles.blurEffect, animatedStyle, { borderColor }]} />
}
