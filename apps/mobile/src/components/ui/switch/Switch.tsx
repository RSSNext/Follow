import type { useState } from "react"
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react"
import type { SwitchChangeEvent } from "react-native"
import { Animated, Easing, Pressable, StyleSheet, useAnimatedValue, View } from "react-native"

import { accentColor, useColor } from "@/src/theme/colors"

export interface SwitchProps {
  onChange?: ((event: SwitchChangeEvent) => Promise<void> | void) | null | undefined

  /**
   * Invoked with the new value when the value changes.
   */
  onValueChange?: ((value: boolean) => Promise<void> | void) | null | undefined

  /**
   * The value of the switch. If true the switch will be turned on.
   * Default value is false.
   */
  value?: boolean | undefined

  size?: "sm" | "default"
}

export type SwitchRef = {
  value: boolean
}
export const Switch = forwardRef<SwitchRef, SwitchProps>(
  ({ value, onValueChange, onChange, size = "default" }, ref) => {
    const animatedValue = useAnimatedValue(0)
    const circleWidthAnimatedValue = useAnimatedValue(0)
    const translateX = useAnimatedValue(0)
    const colorAnimatedValue = useAnimatedValue(0)

    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: value ? 1 : 0,
        duration: 110,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start()

      Animated.timing(colorAnimatedValue, {
        toValue: value ? 1 : 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start()
    }, [value])

    const onTouchStart = () => {
      Animated.timing(circleWidthAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start()
      if (value)
        Animated.timing(translateX, {
          toValue: size === "sm" ? -4 : -7,
          duration: 200,
          useNativeDriver: false,
        }).start()
    }

    const onTouchEnd = () => {
      Animated.timing(circleWidthAnimatedValue, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start()
      Animated.timing(translateX, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start()
    }

    const moveToggle = useMemo(
      () =>
        animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: size === "sm" ? [2, 20] : [2.3, 22],
        }),
      [animatedValue, size],
    )

    const circleWidth = useMemo(
      () =>
        circleWidthAnimatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: size === "sm" ? [18, 21] : [27.8, 35],
        }),
      [circleWidthAnimatedValue, size],
    )

    useImperativeHandle(ref, () => ({
      value: !!value,
    }))

    const activeBgColor = accentColor
    const inactiveBgColor = useColor("secondarySystemFill")
    const bgColor = colorAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [inactiveBgColor, activeBgColor],
    })

    return (
      <View style={styles.container}>
        <Pressable
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onPress={() => {
            onValueChange?.(!value)
            onChange?.({ target: { value: !value } as any } as SwitchChangeEvent)
          }}
        >
          <Animated.View
            style={[
              size === "sm" ? styles.toggleContainerSm : styles.toggleContainer,
              {
                backgroundColor: bgColor,
              },
            ]}
          >
            <Animated.View
              style={[
                size === "sm" ? styles.toggleWheelStyleSm : styles.toggleWheelStyle,
                {
                  marginLeft: moveToggle,
                  width: circleWidth,
                  transform: [{ translateX }, { translateY: -0.4 }],
                },
              ]}
            />
          </Animated.View>
        </Pressable>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: { display: "flex", justifyContent: "space-between" },
  toggleContainer: {
    width: 52,
    height: 32.7,
    borderRadius: 4000,
    justifyContent: "center",
  },
  toggleContainerSm: {
    width: 40,
    height: 24,
    borderRadius: 4000,
    justifyContent: "center",
  },
  toggleWheelStyle: {
    height: 28.5,
    backgroundColor: "#ffffff",
    borderRadius: 200,
    shadowColor: "#515151",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
  },
  toggleWheelStyleSm: {
    height: 20,
    backgroundColor: "#ffffff",
    borderRadius: 200,
    shadowColor: "#515151",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
  },
})
