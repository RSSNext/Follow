import { useState } from "react"

import { BottomTabBarHeightContext } from "@/src/components/layouts/tabbar/contexts/BottomTabBarHeightContext"

import { SetBottomTabBarHeightContext } from "./contexts/BottomTabBarHeightContext"

export const BottomTabHeightProvider = ({ children }: { children: React.ReactNode }) => {
  const [height, setHeight] = useState(0)

  return (
    <BottomTabBarHeightContext.Provider value={height}>
      <SetBottomTabBarHeightContext.Provider value={setHeight}>
        {children}
      </SetBottomTabBarHeightContext.Provider>
    </BottomTabBarHeightContext.Provider>
  )
}
