import { rgbStringToRgb } from "@follow/utils"
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
  return rgbStringToRgb(colors.systemBackground)
}
