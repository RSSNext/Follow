import type { PrimitiveAtom } from "jotai"
import type { ReactNode } from "react"
import { createContext } from "react"

export interface TabScreenContextType {
  tabScreenIndex: number
  Slot: PrimitiveAtom<{
    header: ReactNode
  }>
}
export const TabScreenContext = createContext<TabScreenContextType>(null!)
