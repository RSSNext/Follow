import type { PrimitiveAtom } from "jotai"
import { atom } from "jotai"
import type { Dispatch, SetStateAction } from "react"
import { createContext, useContext, useState } from "react"
import type { Animated } from "react-native"
import { useAnimatedValue } from "react-native"

import { SearchType } from "./constants"

interface SearchPageContextType {
  searchFocusedAtom: PrimitiveAtom<boolean>
  searchValueAtom: PrimitiveAtom<string>

  searchTypeAtom: PrimitiveAtom<SearchType>
}
export const SearchPageContext = createContext<SearchPageContextType>(null!)

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

export const SearchPageProvider = ({ children }: { children: React.ReactNode }) => {
  const [atomRefs] = useState((): SearchPageContextType => {
    const searchFocusedAtom = atom(true)
    const searchValueAtom = atom("")
    const searchTypeAtom = atom(SearchType.Feed)
    return {
      searchFocusedAtom,
      searchValueAtom,
      searchTypeAtom,
    }
  })
  return <SearchPageContext.Provider value={atomRefs}>{children}</SearchPageContext.Provider>
}

const SearchPageScrollContainerAnimatedXContext = createContext<Animated.Value>(null!)
export const SearchPageScrollContainerAnimatedXProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const scrollContainerAnimatedX = useAnimatedValue(0)
  return (
    <SearchPageScrollContainerAnimatedXContext.Provider value={scrollContainerAnimatedX}>
      {children}
    </SearchPageScrollContainerAnimatedXContext.Provider>
  )
}

export const useSearchPageScrollContainerAnimatedX = () => {
  return useContext(SearchPageScrollContainerAnimatedXContext)
}
export const useSearchPageContext = () => {
  const ctx = useContext(SearchPageContext)
  if (!ctx) throw new Error("useDiscoverPageContext must be used within a DiscoverPageProvider")
  return ctx
}
