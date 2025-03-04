import { useContext } from "react"

import { NavigationHeaderHeightContext } from "../views/NavigationHeaderContext"

export const useNavigationHeaderHeight = () => {
  const headerHeight = useContext(NavigationHeaderHeightContext)
  if (!headerHeight) {
    throw new Error("NavigationHeaderHeightContext is not found")
  }
  return headerHeight
}
