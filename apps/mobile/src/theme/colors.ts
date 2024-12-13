import { vars } from "nativewind"
import type { StyleProp, ViewStyle } from "react-native"
import { Appearance, StyleSheet } from "react-native"

const varPrefix = "--color"

const buildVars = (_vars: Record<string, string>) => {
  const cssVars = {} as Record<`${typeof varPrefix}-${string}`, string>
  for (const [key, value] of Object.entries(_vars)) {
    cssVars[`${varPrefix}-${key}`] = value
  }

  return vars(cssVars)
}

const lightPalette = {
  red: "255 59 48",
  orange: "255 149 0",
  yellow: "255 204 0",
  green: "52 199 89",
  mint: "0 199 190",
  teal: "48 176 190",
  cyan: "50 173 200",
  blue: "0 122 255",
  indigo: "88 86 214",
  purple: "175 82 222",
  pink: "255 45 85",
  brown: "162 132 94",
  gray: "142 142 147",
  gray2: "172 172 178",
  gray3: "199 199 204",
  gray4: "209 209 214",
  gray5: "229 229 234",
  gray6: "242 242 247",
}
const darkPalette = {
  red: "255 69 58",
  orange: "255 175 113",
  yellow: "255 214 10",
  green: "48 209 88",
  mint: "99 230 226",
  teal: "64 200 244",
  cyan: "100 210 255",
  blue: "10 132 255",
  indigo: "94 92 230",
  purple: "191 90 242",
  pink: "255 55 95",
  brown: "172 142 104",
  gray: "142 142 147",
  gray2: "99 99 102",
  gray3: "72 72 74",
  gray4: "58 58 60",
  gray5: "44 44 46",
  gray6: "28 28 30",
}
const palette = {
  // iOS color palette https://developer.apple.com/design/human-interface-guidelines/color
  light: buildVars(lightPalette),
  dark: buildVars(darkPalette),
}

const lightVariants = {
  // UIKit Colors
  label: "0 0 0",
  secondaryLabel: "122 122 122",
  tertiaryLabel: "172 172 178",
  quaternaryLabel: "199 199 204",
  placeholderText: "199 199 204",
  separator: "209 209 214",
  opaqueSeparator: "229 229 234",
  link: "0 122 255",
  systemBackground: "255 255 255",
  secondarySystemBackground: "242 242 247",
  tertiarySystemBackground: "229 229 234",
  systemGroupedBackground: "242 242 247",
  secondarySystemGroupedBackground: "229 229 234",
  tertiarySystemGroupedBackground: "209 209 214",

  // System Colors
  systemFill: "209 213 219",
  secondarySystemFill: "209 213 219",
  tertiarySystemFill: "209 213 219",
  quaternarySystemFill: "209 213 219",

  // Text Colors
  text: "0 0 0",
  secondaryText: "142 142 147",
  tertiaryText: "99 99 102",
  quaternaryText: "72 72 74",
}
const darkVariants = {
  // UIKit Colors
  label: "255 255 255",
  secondaryLabel: "172 172 178",
  tertiaryLabel: "122 122 122",
  quaternaryLabel: "99 99 102",
  placeholderText: "122 122 122",
  separator: "72 72 74",
  opaqueSeparator: "58 58 60",
  link: "10 132 255",
  systemBackground: "0 0 0",
  secondarySystemBackground: "28 28 30",
  tertiarySystemBackground: "44 44 46",
  systemGroupedBackground: "28 28 30",
  secondarySystemGroupedBackground: "44 44 46",
  tertiarySystemGroupedBackground: "72 72 74",

  // System Colors
  systemFill: "72 72 74",
  secondarySystemFill: "99 99 102",
  tertiarySystemFill: "122 122 122",
  quaternarySystemFill: "142 142 147",

  // Text Colors
  text: "255 255 255",
  secondaryText: "172 172 178",
  tertiaryText: "122 122 122",
  quaternaryText: "99 99 102",
}
const variants = {
  light: buildVars(lightVariants),
  dark: buildVars(darkVariants),
}

export const getCurrentColors = () => {
  const colorScheme = Appearance.getColorScheme() || "light"

  return StyleSheet.compose(variants[colorScheme], palette[colorScheme]) as StyleProp<ViewStyle>
}

/// Utils

const toRgb = (hex: string) => {
  const [r, g, b] = hex.split(" ").map((s) => Number.parseInt(s))
  return `rgb(${r} ${g} ${b})`
}

export const getSystemBackgroundColor = () => {
  const colorScheme = Appearance.getColorScheme() || "light"

  const colors = colorScheme === "light" ? lightVariants : darkVariants
  return toRgb(colors.systemBackground)
}
