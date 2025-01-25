import type { Theme } from "@react-navigation/native"
import {
  DarkTheme as NativeDarkTheme,
  DefaultTheme as NativeDefaultTheme,
} from "@react-navigation/native"

import { accentColor } from "./colors"

export const DefaultTheme: Theme = {
  ...NativeDefaultTheme,
  colors: {
    ...NativeDefaultTheme.colors,
    primary: accentColor,
    background: "white",
  },
}

export const DarkTheme: Theme = {
  ...NativeDarkTheme,
  colors: {
    ...NativeDarkTheme.colors,
    primary: accentColor,
    background: "black",
  },
}
