import { createContext } from "react"
import type { SharedValue } from "react-native-reanimated"

interface TabBarBackgroundContextType {
  opacity: SharedValue<number>
}

export const TabBarBackgroundContext = createContext<TabBarBackgroundContextType>({
  opacity: null!,
})
