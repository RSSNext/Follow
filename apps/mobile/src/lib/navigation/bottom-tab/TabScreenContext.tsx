import { createContext } from "react"

interface TabScreenContextType {
  tabScreenIndex: number
}
export const TabScreenContext = createContext<TabScreenContextType>(null!)
