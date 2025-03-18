import { useAtom, useAtomValue } from "jotai"
import type { FC } from "react"
import { memo, useContext, useEffect } from "react"
import type { StyleProp, TextStyle } from "react-native"
import { Platform, Pressable, StyleSheet, Text, View } from "react-native"
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { SetBottomTabBarHeightContext } from "@/src/components/layouts/tabbar/contexts/BottomTabBarHeightContext"
import { gentleSpringPreset, quickSpringPreset, softSpringPreset } from "@/src/constants/spring"
import { BottomTabContext } from "@/src/lib/navigation/bottom-tab/BottomTabContext"
import type { TabbarIconProps } from "@/src/lib/navigation/bottom-tab/types"
import { PlayerTabBar } from "@/src/modules/player/PlayerTabBar"
import { accentColor } from "@/src/theme/colors"

import { ThemedBlurView } from "../../common/ThemedBlurView"
import { Grid } from "../../ui/grid"
import { BottomTabBarBackgroundContext } from "./contexts/BottomTabBarBackgroundContext"
import { BottomTabBarVisibleContext } from "./contexts/BottomTabBarVisibleContext"

export const Tabbar: FC<{
  onPress?: (index: number) => void
}> = ({ onPress: onPressProp }) => {
  const setTabBarHeight = useContext(SetBottomTabBarHeightContext)

  const insets = useSafeAreaInsets()
  const tabBarVisible = useContext(BottomTabBarVisibleContext)

  const tabContext = useContext(BottomTabContext)
  const tabScreens = useAtomValue(tabContext.tabScreensAtom)
  const [selectedIndex, setSelectedIndex] = useAtom(tabContext.currentIndexAtom)
  const translateY = useSharedValue(0)

  useEffect(() => {
    cancelAnimation(translateY)
    translateY.value = withSpring(
      tabBarVisible ? 0 : 100,
      !tabBarVisible ? quickSpringPreset : softSpringPreset,
    )
  }, [tabBarVisible, translateY])
  if (tabScreens.length === 0) return null
  return (
    <Animated.View
      accessibilityRole="tablist"
      className="absolute inset-x-0 bottom-0 z-10"
      style={{
        paddingBottom: insets.bottom,
        transform: [{ translateY }],
      }}
      onLayout={(e) => {
        setTabBarHeight(e.nativeEvent.layout.height)
      }}
    >
      <TabBarBackground />
      <PlayerTabBar />
      <Grid columns={tabScreens.length} gap={10} className="mt-[7]">
        {tabScreens.map((route, index) => {
          const focused = index === selectedIndex

          const inactiveTintColor = "#999"
          const onPress = () => {
            setSelectedIndex(index)
            onPressProp?.(index)
          }

          const label = route.title

          const accessibilityLabel =
            typeof label === "string" && Platform.OS === "ios"
              ? `${label}, tab, ${index + 1} of ${tabScreens.length}`
              : undefined

          const renderIcon = ({ focused }: { focused: boolean }) => {
            const iconSize = ICON_SIZE_ROUND
            return (
              <TabIcon
                focused={focused}
                iconSize={iconSize}
                inactiveTintColor={inactiveTintColor}
                renderIcon={route.renderIcon! || noop}
              />
            )
          }

          const renderLabel = ({ focused }: { focused: boolean }) => {
            return (
              <TextLabel
                focused={focused}
                accessibilityLabel={accessibilityLabel}
                label={label}
                inactiveTintColor={inactiveTintColor}
                style={styles.labelBeneath}
              />
            )
          }

          return (
            <TabItem
              key={route.tabScreenIndex}
              route={route}
              focused={focused}
              onPress={onPress}
              originalRenderIcon={renderIcon}
              originalRenderLabel={renderLabel}
              accessibilityLabel={accessibilityLabel}
            />
          )
        })}
      </Grid>
    </Animated.View>
  )
}

const TextLabel = (props: {
  focused: boolean
  accessibilityLabel: string | undefined
  label: string
  inactiveTintColor: string
  style: StyleProp<TextStyle>
}) => {
  const { focused, accessibilityLabel, label, inactiveTintColor, style } = props

  return (
    <Text
      numberOfLines={1}
      accessibilityLabel={accessibilityLabel}
      style={StyleSheet.flatten([style, { color: focused ? accentColor : inactiveTintColor }])}
      allowFontScaling
    >
      {label}
    </Text>
  )
}
const TabIcon = ({
  focused,
  iconSize,
  inactiveTintColor,
  renderIcon,
}: {
  focused: boolean
  iconSize: number
  inactiveTintColor: string
  renderIcon: (options: TabbarIconProps) => React.ReactNode
}) => {
  const activeOpacity = focused ? 1 : 0
  const inactiveOpacity = focused ? 0 : 1

  const opacity = useSharedValue(focused ? 1 : 0.8)
  const scale = useSharedValue(focused ? 1 : 0.92)
  const rotate = useSharedValue(focused ? 0 : 0.2)

  useEffect(() => {
    if (focused) {
      opacity.value = withSpring(1)
      scale.value = withSpring(1)
      rotate.value = withSpring(0)
    } else {
      opacity.value = 0.8
      scale.value = 0.92
      rotate.value = 0.2
    }
  }, [focused, opacity, scale, rotate])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }, { rotate: `${rotate.value}rad` }],
    }
  })

  return (
    <View style={styles.wrapperUikit}>
      {focused && (
        <Animated.View style={[styles.icon, { opacity: activeOpacity }, animatedStyle]}>
          {renderIcon({
            focused: true,
            size: iconSize,
            color: accentColor,
          })}
        </Animated.View>
      )}
      {!focused && (
        <Animated.View style={[styles.icon, { opacity: inactiveOpacity }]}>
          {renderIcon({
            focused: false,
            size: iconSize,
            color: inactiveTintColor,
          })}
        </Animated.View>
      )}
    </View>
  )
}

// @copy node_modules/@react-navigation/bottom-tabs/src/views/TabBarIcon.tsx
const ICON_SIZE_WIDE = 31
const ICON_SIZE_TALL = 28
const ICON_SIZE_ROUND = 25
const styles = StyleSheet.create({
  labelBeneath: {
    fontSize: 10,
  },
  blurEffect: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  icon: {
    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them:
    // Cover the whole iconContainer:
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  wrapperUikit: {
    width: ICON_SIZE_WIDE,
    height: ICON_SIZE_TALL,
  },
})

const AnimatedThemedBlurView = Animated.createAnimatedComponent(ThemedBlurView)
const TabBarBackground = () => {
  const { opacity } = useContext(BottomTabBarBackgroundContext)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    ...styles.blurEffect,
  }))
  const separatorStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))
  return (
    <View style={styles.blurEffect}>
      <AnimatedThemedBlurView style={[styles.blurEffect, animatedStyle]} />
      <Animated.View
        className="bg-opaque-separator absolute top-0 w-full"
        style={[
          separatorStyle,
          {
            height: StyleSheet.hairlineWidth,
          },
        ]}
      />
    </View>
  )
}

const TabItem = memo(
  ({
    route,
    focused,

    onPress,
    originalRenderIcon,
    originalRenderLabel,
    accessibilityLabel,
  }: {
    route: any
    focused: boolean

    onPress: () => void
    originalRenderIcon: (scene: { route: any; focused: boolean }) => React.ReactNode
    originalRenderLabel: (scene: { route: any; focused: boolean }) => React.ReactNode
    accessibilityLabel?: string
  }) => {
    const pressed = useSharedValue(0)

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: 1 - 0.15 * pressed.value }],
      }
    })

    const scene = { route, focused }

    return (
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          pressed.value = withSpring(1, gentleSpringPreset)
        }}
        onPressOut={() => {
          pressed.value = withSpring(0, gentleSpringPreset)
        }}
        className="flex-1 flex-col items-center justify-center"
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ selected: focused }}
      >
        <Animated.View style={animatedStyle}>{originalRenderIcon(scene)}</Animated.View>
        {originalRenderLabel(scene)}
      </Pressable>
    )
  },
)

const noop = () => null
