import { createContext, useContext } from "react"
import type { ScrollView } from "react-native"
import type { AnimatedRef, SharedValue } from "react-native-reanimated"

interface ModalScrollViewContextType {
  scrollViewRef: AnimatedRef<ScrollView>
  animatedY: SharedValue<number>
}
export const ModalScrollViewContext = createContext<ModalScrollViewContextType>(null!)

export const useModalScrollViewContext = () => {
  const context = useContext(ModalScrollViewContext)
  if (!context) {
    throw new Error("ModalScrollViewContext not found")
  }
  return context
}
