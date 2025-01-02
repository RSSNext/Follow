import type { StyleProp, ViewStyle } from "react-native"
import { Appearance, StyleSheet } from "react-native"

import { colorVariants, darkVariants, lightVariants, palette } from "./colors"

export const getCurrentColors = () => {
  const colorScheme = Appearance.getColorScheme() || "light"

  return StyleSheet.compose(
    colorVariants[colorScheme],
    palette[colorScheme],
  ) as StyleProp<ViewStyle>
}

export const getSystemBackgroundColor = () => {
  const colorScheme = Appearance.getColorScheme() || "light"

  const colors = colorScheme === "light" ? lightVariants : darkVariants
  return toRgb(colors.systemBackground)
}

const toRgb = (hex: string) => {
  const [r, g, b] = hex.split(" ").map((s) => Number.parseInt(s))
  return `rgb(${r} ${g} ${b})`
}
