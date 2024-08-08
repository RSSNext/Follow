import { createContext, useContext } from "react"

export const MasonryItemWidthContext = createContext(0)

export const useMasonryItemWidth = () => useContext(MasonryItemWidthContext)
