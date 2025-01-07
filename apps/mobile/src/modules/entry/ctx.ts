import { createContext, useContext } from "react"

const SharedElementAnimationContext = createContext<boolean>(true)
export const SharedElementAnimationContextProvider = SharedElementAnimationContext.Provider
export const useShouldAnimate = () => useContext(SharedElementAnimationContext)
