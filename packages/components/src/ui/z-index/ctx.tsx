import { createContext, useContext } from "react"

export const ZIndexContext = createContext(0)

export const useCorrectZIndex = (zIndex: number) => useContext(ZIndexContext) + zIndex
