import type { PrimitiveAtom } from "jotai"
import { createContext } from "react"
import type { SharedValue } from "react-native-reanimated"

interface ScreenItemContextType {
  screenId: string

  isFocusedAtom: PrimitiveAtom<boolean>
  isAppearedAtom: PrimitiveAtom<boolean>
  isDisappearedAtom: PrimitiveAtom<boolean>

  reAnimatedScrollY: SharedValue<number>
}
export const ScreenItemContext = createContext<ScreenItemContextType>(null!)
