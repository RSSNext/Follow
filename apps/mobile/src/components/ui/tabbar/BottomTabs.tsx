import type { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { Tabs } from "expo-router"
import type { ForwardRefExoticComponent } from "react"
import { forwardRef, useMemo, useState } from "react"
import { useSharedValue } from "react-native-reanimated"

import { BottomTabBarBackgroundContext } from "./BottomTabBarBackgroundContext"
import {
  BottomTabBarVisibleContext,
  SetBottomTabBarVisibleContext,
} from "./BottomTabBarVisibleContext"
import { BottomTabHeightProvider } from "./BottomTabHeightProvider"
import { Tabbar } from "./Tabbar"

type ExtractReactForwardRefExoticComponent<T> =
  T extends React.ForwardRefExoticComponent<infer P> ? P : never

export const BottomTabs: ForwardRefExoticComponent<
  Omit<ExtractReactForwardRefExoticComponent<typeof Tabs>, "tabBar">
> = forwardRef((props, ref) => {
  const opacity = useSharedValue(1)
  const [tabBarVisible, setTabBarVisible] = useState(true)
  return (
    <BottomTabBarBackgroundContext.Provider value={useMemo(() => ({ opacity }), [opacity])}>
      <SetBottomTabBarVisibleContext.Provider value={setTabBarVisible}>
        <BottomTabBarVisibleContext.Provider value={tabBarVisible}>
          <BottomTabHeightProvider>
            <Tabs
              {...props}
              tabBar={TabBar}
              screenListeners={{
                ...props.screenListeners,
                tabPress: (e) => {
                  if (props.screenListeners && "tabPress" in props.screenListeners) {
                    props.screenListeners.tabPress!(e)
                  }
                  opacity.value = 1
                },
                transitionStart: (e) => {
                  if (props.screenListeners && "transitionStart" in props.screenListeners) {
                    props.screenListeners.transitionStart!(e)
                  }
                  opacity.value = 1
                },
              }}
              ref={ref}
            />
          </BottomTabHeightProvider>
        </BottomTabBarVisibleContext.Provider>
      </SetBottomTabBarVisibleContext.Provider>
    </BottomTabBarBackgroundContext.Provider>
  )
})
const TabBar = (props: BottomTabBarProps) => <Tabbar {...props} />
