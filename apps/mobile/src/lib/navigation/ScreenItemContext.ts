import type { PrimitiveAtom } from "jotai"
import type { FC, ReactNode } from "react"
import { createContext } from "react"
import type { SharedValue } from "react-native-reanimated"

export interface ScreenItemContextType {
  screenId: string

  isFocusedAtom: PrimitiveAtom<boolean>
  isAppearedAtom: PrimitiveAtom<boolean>
  isDisappearedAtom: PrimitiveAtom<boolean>

  reAnimatedScrollY: SharedValue<number>

  Slot: PrimitiveAtom<{
    header: ReactNode
  }>
}
export const ScreenItemContext = createContext<ScreenItemContextType>(null!)
