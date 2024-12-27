import type { PrimitiveAtom } from "jotai"
import { atom } from "jotai"
import { createContext, useContext, useState } from "react"

interface DiscoverPageContextType {
  searchFocusedAtom: PrimitiveAtom<boolean>
  searchValueAtom: PrimitiveAtom<string>
}
export const DiscoverPageContext = createContext<DiscoverPageContextType>(null!)

export const DiscoverPageProvider = ({ children }: { children: React.ReactNode }) => {
  const [atomRefs] = useState((): DiscoverPageContextType => {
    const searchFocusedAtom = atom(false)
    const searchValueAtom = atom("")

    return {
      searchFocusedAtom,
      searchValueAtom,
    }
  })
  return <DiscoverPageContext.Provider value={atomRefs}>{children}</DiscoverPageContext.Provider>
}

export const useDiscoverPageContext = () => {
  const ctx = useContext(DiscoverPageContext)
  if (!ctx) throw new Error("useDiscoverPageContext must be used within a DiscoverPageProvider")
  return ctx
}
