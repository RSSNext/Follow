import { createContext, useContext } from "react"

export const PlayerScreenContext = createContext<PlayerScreenContextValue | null>(null)
export const usePlayerScreenContext = () => {
  const context = useContext(PlayerScreenContext)
  if (!context) {
    throw new Error("usePlayerScreenContext must be used within a PlayerScreenContextProvider")
  }
  return context
}

interface PlayerScreenContextValue {
  isBackgroundLight: boolean
}
