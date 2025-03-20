import { requireNativeView } from "expo"
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { useContext, useEffect, useMemo } from "react"
import type { ViewProps } from "react-native"
import { StyleSheet } from "react-native"

import { WrappedScreenItem } from "../WrappedScreenItem"
import { BottomTabContext } from "./BottomTabContext"
import { LifecycleEvents, ScreenNameRegister } from "./shared"
import type { TabScreenContextType } from "./TabScreenContext"
import { TabScreenContext } from "./TabScreenContext"
import type { TabbarIconProps, TabScreenComponent } from "./types"

const TabScreenNative = requireNativeView<ViewProps>("TabScreen")

export interface TabScreenProps {
  title: string
  tabScreenIndex: number
  renderIcon?: (props: TabbarIconProps) => React.ReactNode
  lazy?: boolean
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

  const mergedProps = useMemo(() => {
    const propsFromChildren: Partial<TabScreenProps> = {}
    if (children && typeof children === "object") {
      const childType = (children as any).type as TabScreenComponent
      if ("tabBarIcon" in childType) {
        propsFromChildren.renderIcon = childType.tabBarIcon
      }
      if ("title" in childType) {
        propsFromChildren.title = childType.title
      }
      if ("lazy" in childType) {
        propsFromChildren.lazy = childType.lazy
      }
    }
    return {
      ...propsFromChildren,
      ...props,
    }
  }, [children, props])
  useEffect(() => {
    setTabScreens((prev) => [
      ...prev,
      {
        ...mergedProps,
        tabScreenIndex,
      },
    ])

    return () => {
      setTabScreens((prev) =>
        prev.filter((tabScreen) => tabScreen.tabScreenIndex !== tabScreenIndex),
      )
    }
  }, [setTabScreens, props, tabScreenIndex, children, mergedProps])

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
  const shouldLoadReact = mergedProps.lazy ? isSelected || isLoadedBefore : true

  return (
    <TabScreenNative style={StyleSheet.absoluteFill}>
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
    </TabScreenNative>
  )
}
