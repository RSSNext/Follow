import { useMemo, useState } from "react"
import { useSharedValue } from "react-native-reanimated"

import { BottomTabHeightProvider } from "./BottomTabHeightProvider"
import { BottomTabBarBackgroundContext } from "./contexts/BottomTabBarBackgroundContext"
import {
  BottomTabBarVisibleContext,
  SetBottomTabBarVisibleContext,
} from "./contexts/BottomTabBarVisibleContext"

export const BottomTabProvider = ({ children }: { children: React.ReactNode }) => {
  const opacity = useSharedValue(1)
  const [tabBarVisible, setTabBarVisible] = useState(true)

  return (
    <BottomTabBarBackgroundContext.Provider value={useMemo(() => ({ opacity }), [opacity])}>
      <SetBottomTabBarVisibleContext.Provider value={setTabBarVisible}>
        <BottomTabBarVisibleContext.Provider value={tabBarVisible}>
          <BottomTabHeightProvider>{children}</BottomTabHeightProvider>
        </BottomTabBarVisibleContext.Provider>
      </SetBottomTabBarVisibleContext.Provider>
    </BottomTabBarBackgroundContext.Provider>
  )
}
