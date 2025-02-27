import type { PrimitiveAtom } from "jotai"
import { createContext } from "react"
import type { Animated } from "react-native"
import type { SharedValue } from "react-native-reanimated"

export const DiscoverContext = createContext<{
  animatedX: Animated.Value
  currentTabAtom: PrimitiveAtom<number>

  headerHeightAtom: PrimitiveAtom<number>
  animatedY: SharedValue<number>
}>(null!)
