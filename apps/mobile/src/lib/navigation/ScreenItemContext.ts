import type { PrimitiveAtom } from "jotai"
import { createContext } from "react"

interface ScreenItemContextType {
  screenId: string

  isFocusedAtom: PrimitiveAtom<boolean>
  isAppearedAtom: PrimitiveAtom<boolean>
  isDisappearedAtom: PrimitiveAtom<boolean>
}
export const ScreenItemContext = createContext<ScreenItemContextType>(null!)
