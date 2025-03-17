import { useMemo, useState } from "react"
import type { ScrollView } from "react-native"
import { useSharedValue } from "react-native-reanimated"

import { BottomTabHeightProvider } from "./BottomTabHeightProvider"
import {
  AttachNavigationScrollViewContext,
  SetAttachNavigationScrollViewContext,
} from "./contexts/AttachNavigationScrollViewContext"
import { BottomTabBarBackgroundContext } from "./contexts/BottomTabBarBackgroundContext"
import {
  BottomTabBarVisibleContext,
  SetBottomTabBarVisibleContext,
} from "./contexts/BottomTabBarVisibleContext"

export const BottomTabProvider = ({ children }: { children: React.ReactNode }) => {
  const opacity = useSharedValue(1)
  const [tabBarVisible, setTabBarVisible] = useState(true)
  const [attachNavigationScrollViewRef, setAttachNavigationScrollViewRef] =
    useState<React.RefObject<ScrollView> | null>(null)

  return (
    <AttachNavigationScrollViewContext.Provider value={attachNavigationScrollViewRef}>
      <SetAttachNavigationScrollViewContext.Provider value={setAttachNavigationScrollViewRef}>
        <BottomTabBarBackgroundContext.Provider value={useMemo(() => ({ opacity }), [opacity])}>
          <SetBottomTabBarVisibleContext.Provider value={setTabBarVisible}>
            <BottomTabBarVisibleContext.Provider value={tabBarVisible}>
              <BottomTabHeightProvider>{children}</BottomTabHeightProvider>
            </BottomTabBarVisibleContext.Provider>
          </SetBottomTabBarVisibleContext.Provider>
        </BottomTabBarBackgroundContext.Provider>
      </SetAttachNavigationScrollViewContext.Provider>
    </AttachNavigationScrollViewContext.Provider>
  )
}
