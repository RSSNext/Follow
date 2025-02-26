import { createContext } from "react"
import type { Animated } from "react-native"

export const NavigationContext = createContext<{
  scrollY: Animated.Value
} | null>(null)
