import { requireNativeView } from "expo"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { useContext, useEffect, useId, useMemo, useState } from "react"
import type { ViewProps } from "react-native"
import { StyleSheet } from "react-native"

import { BottomTabContext } from "./BottomTabContext"
import { TabScreenContext } from "./TabScreenContext"
import type { TabbarIconProps, TabScreenComponent } from "./types"

const TabScreenNative = requireNativeView<ViewProps>("TabScreen")

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
    let propsFromChildren: Partial<TabScreenProps> = {}
    if (children && typeof children === "object") {
      const childType = (children as any).type as TabScreenComponent
      if ("tabBarIcon" in childType) {
        propsFromChildren.renderIcon = childType.tabBarIcon
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

  const ctxValue = useMemo(() => ({ tabScreenIndex }), [tabScreenIndex])

  const shouldLoadReact = isSelected || isLoadedBefore

  return (
    <TabScreenNative style={StyleSheet.absoluteFill}>
      <TabScreenContext.Provider value={ctxValue}>
        {shouldLoadReact && children}
      </TabScreenContext.Provider>
    </TabScreenNative>
  )
}
