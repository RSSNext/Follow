import type { PrimitiveAtom } from "jotai"
import { atom } from "jotai"
import type { Dispatch, SetStateAction } from "react"
import { createContext, useContext, useState } from "react"

import { SearchType } from "./constants"

interface DiscoverPageContextType {
  searchFocusedAtom: PrimitiveAtom<boolean>
  searchValueAtom: PrimitiveAtom<string>

  searchTypeAtom: PrimitiveAtom<SearchType>
}
export const DiscoverPageContext = createContext<DiscoverPageContextType>(null!)

const SearchBarHeightContext = createContext<number>(0)
const setSearchBarHeightContext = createContext<Dispatch<SetStateAction<number>>>(() => {})
export const SearchBarHeightProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchBarHeight, setSearchBarHeight] = useState(0)
  return (
    <SearchBarHeightContext.Provider value={searchBarHeight}>
      <setSearchBarHeightContext.Provider value={setSearchBarHeight}>
        {children}
      </setSearchBarHeightContext.Provider>
    </SearchBarHeightContext.Provider>
  )
}

export const useSearchBarHeight = () => {
  return useContext(SearchBarHeightContext)
}
export const useSetSearchBarHeight = () => {
  return useContext(setSearchBarHeightContext)
}

export const DiscoverPageProvider = ({ children }: { children: React.ReactNode }) => {
  const [atomRefs] = useState((): DiscoverPageContextType => {
    const searchFocusedAtom = atom(true)
    const searchValueAtom = atom("")
    const searchTypeAtom = atom(SearchType.Feed)
    return {
      searchFocusedAtom,
      searchValueAtom,
      searchTypeAtom,
    }
  })
  return <DiscoverPageContext.Provider value={atomRefs}>{children}</DiscoverPageContext.Provider>
}

export const useDiscoverPageContext = () => {
  const ctx = useContext(DiscoverPageContext)
  if (!ctx) throw new Error("useDiscoverPageContext must be used within a DiscoverPageProvider")
  return ctx
}
