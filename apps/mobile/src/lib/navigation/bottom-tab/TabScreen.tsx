import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { useContext, useEffect, useMemo } from "react"
import { StyleSheet, View } from "react-native"

import { WrappedScreenItem } from "../WrappedScreenItem"
import { BottomTabContext } from "./BottomTabContext"
import { LifecycleEvents, ScreenNameRegister } from "./shared"
import type { TabScreenContextType } from "./TabScreenContext"
import { TabScreenContext } from "./TabScreenContext"
import type { TabbarIconProps, TabScreenComponent } from "./types"

export interface TabScreenProps {
  title: string
  tabScreenIndex: number
  renderIcon?: (props: TabbarIconProps) => React.ReactNode
}
export const TabScreen: FC<PropsWithChildren<Omit<TabScreenProps, "tabScreenIndex">>> = ({
  children,
  ...props
}) => {
  const { tabScreenIndex } = props as any as TabScreenProps

  const {
    loadedableIndexAtom,
    currentIndexAtom,
    tabScreensAtom: tabScreens,
  } = useContext(BottomTabContext)

  const setTabScreens = useSetAtom(tabScreens)
  useEffect(() => {
    const propsFromChildren: Partial<TabScreenProps> = {}
    if (children && typeof children === "object") {
      const childType = (children as any).type as TabScreenComponent
      if ("tabBarIcon" in childType) {
        propsFromChildren.renderIcon = childType.tabBarIcon
      }
      if ("title" in childType) {
        propsFromChildren.title = childType.title
      }
    }

    setTabScreens((prev) => [
      ...prev,
      {
        ...propsFromChildren,
        ...props,
        tabScreenIndex,
      },
    ])

    return () => {
      setTabScreens((prev) =>
        prev.filter((tabScreen) => tabScreen.tabScreenIndex !== tabScreenIndex),
      )
    }
  }, [setTabScreens, props, tabScreenIndex, children])

  const currentSelectedIndex = useAtomValue(currentIndexAtom)

  const isSelected = useMemo(
    () => currentSelectedIndex === tabScreenIndex,
    [currentSelectedIndex, tabScreenIndex],
  )

  const [loadedableIndexSet, setLoadedableIndex] = useAtom(loadedableIndexAtom)

  const isLoadedBefore = loadedableIndexSet.has(tabScreenIndex)
  useEffect(() => {
    if (isSelected) {
      setLoadedableIndex((prev) => {
        prev.add(tabScreenIndex)
        return new Set(prev)
      })
    }
  }, [setLoadedableIndex, tabScreenIndex, isSelected])

  const ctxValue = useMemo<TabScreenContextType>(
    () => ({
      tabScreenIndex,

      titleAtom: atom(props.title),
    }),
    [tabScreenIndex, props.title],
  )
  const shouldLoadReact = isSelected || isLoadedBefore

  return (
    <View className={isSelected ? "flex-1" : "hidden"} style={StyleSheet.absoluteFill}>
      <TabScreenContext.Provider value={ctxValue}>
        {shouldLoadReact && (
          <WrappedScreenItem screenId={`tab-screen-${tabScreenIndex}`}>
            {children}
            <ScreenNameRegister />
            <LifecycleEvents isSelected={isSelected} />
            {/* <CalculateTabBarOpacity /> */}
          </WrappedScreenItem>
        )}
      </TabScreenContext.Provider>
    </View>
  )
}
