import type { PrimitiveAtom } from "jotai"
import { useAtomValue } from "jotai"
import { createContext, useContext } from "react"

export const ScreenNameContext = createContext<PrimitiveAtom<string>>(null!)

export const useScreenName = () => {
  const name = useContext(ScreenNameContext)
  if (!name) {
    throw new Error("ScreenNameContext not mounted")
  }
  return useAtomValue(name)
}
