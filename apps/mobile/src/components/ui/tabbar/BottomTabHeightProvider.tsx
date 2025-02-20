import { useState } from "react"

import { BottomTabBarHeightContext } from "@/src/components/ui/tabbar/context"

import { SetBottomTabBarHeightContext } from "./context"

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
