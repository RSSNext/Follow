import { useContext } from "react"

import { BottomTabBarHeightContext } from "./contexts/BottomTabBarHeightContext"

export const useBottomTabBarHeight = () => {
  const height = useContext(BottomTabBarHeightContext)
  return height
}
