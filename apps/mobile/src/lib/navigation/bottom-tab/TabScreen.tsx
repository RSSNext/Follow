import { requireNativeView } from "expo"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { useContext, useEffect, useId, useMemo, useState } from "react"
import type { ViewProps } from "react-native"
import { StyleSheet } from "react-native"

import { BottomTabContext } from "./BottomTabContext"
import { TabScreenContext } from "./TabScreenContext"

const TabScreenNative = requireNativeView<ViewProps>("TabScreen")

export interface TabScreenProps {
  title: string
  tabScreenIndex: number
}
export const TabScreen: FC<PropsWithChildren<TabScreenProps>> = ({ children, ...props }) => {
  const { tabScreenIndex } = props

  const {
    loadedableIndexAtom,
    currentIndexAtom,
    tabScreensAtom: tabScreens,
  } = useContext(BottomTabContext)

  const setTabScreens = useSetAtom(tabScreens)
  useEffect(() => {
    setTabScreens((prev) => [...prev, props])

    return () => {
      setTabScreens((prev) =>
        prev.filter((tabScreen) => tabScreen.tabScreenIndex !== tabScreenIndex),
      )
    }
  }, [setTabScreens, props, tabScreenIndex])

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
