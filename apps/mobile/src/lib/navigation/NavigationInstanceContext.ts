import { createContext, useContext } from "react"

import type { Navigation } from "./Navigation"

export const NavigationInstanceContext = createContext<Navigation>(null!)

export const useNavigation = () => {
  const navigation = useContext(NavigationInstanceContext)
  if (!navigation) {
    throw new Error("Navigation not found")
  }
  return navigation
}
