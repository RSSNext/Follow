import { useContext } from "react"

import { BottomTabBarHeightContext } from "./context"

export const useBottomTabBarHeight = () => {
  const height = useContext(BottomTabBarHeightContext)
  return height
}
