import type { PrimitiveAtom } from "jotai"
import { atom, useAtomValue } from "jotai"
import type { FC } from "react"
import { memo, useContext, useMemo, useState } from "react"
import type { ScrollView } from "react-native"
import { StyleSheet } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import type { ScreenStackHeaderConfigProps } from "react-native-screens"
import { ScreenStack } from "react-native-screens"

import {
  AttachNavigationScrollViewContext,
  SetAttachNavigationScrollViewContext,
} from "./AttachNavigationScrollViewContext"
import type { Route } from "./ChainNavigationContext"
import { ChainNavigationContext } from "./ChainNavigationContext"
import { GroupedNavigationRouteContext } from "./GroupedNavigationRouteContext"
import { Navigation } from "./Navigation"
import { NavigationInstanceContext } from "./NavigationInstanceContext"
import { ScreenNameContext } from "./ScreenNameContext"
import type { ScreenOptionsContextType } from "./ScreenOptionsContext"
import { ModalScreenItemOptionsContext } from "./ScreenOptionsContext"
import type { NavigationControllerView } from "./types"
import { WrappedScreenItem } from "./WrappedScreenItem"

interface RootStackNavigationProps {
  children: React.ReactNode

  headerConfig?: ScreenStackHeaderConfigProps
}
export const RootStackNavigation = ({ children, headerConfig }: RootStackNavigationProps) => {
  const [attachNavigationScrollViewRef, setAttachNavigationScrollViewRef] =
    useState<React.RefObject<ScrollView> | null>(null)

  return (
    <SafeAreaProvider>
      <AttachNavigationScrollViewContext.Provider value={attachNavigationScrollViewRef}>
        <SetAttachNavigationScrollViewContext.Provider value={setAttachNavigationScrollViewRef}>
          <ScreenNameContext.Provider value={useMemo(() => atom(""), [])}>
            <ChainNavigationContext.Provider
              value={Navigation.rootNavigation.__internal_getCtxValue()}
            >
              <NavigationInstanceContext.Provider value={Navigation.rootNavigation}>
                <ScreenStack style={StyleSheet.absoluteFill}>
                  <WrappedScreenItem headerConfig={headerConfig} screenId="root">
                    {children}
                  </WrappedScreenItem>

                  <ScreenItemsMapper />
                </ScreenStack>
              </NavigationInstanceContext.Provider>
            </ChainNavigationContext.Provider>
          </ScreenNameContext.Provider>
        </SetAttachNavigationScrollViewContext.Provider>
      </AttachNavigationScrollViewContext.Provider>
    </SafeAreaProvider>
  )
}

const ScreenItemsMapper = () => {
  const chainCtxValue = useContext(ChainNavigationContext)
  const routes = useAtomValue(chainCtxValue.routesAtom)

  const routeGroups = useMemo(() => {
    const groups: Route[][] = []
    let currentGroup: Route[] = []

    routes.forEach((route, index) => {
      // Start a new group if this is the first route or if it's a modal (non-push)
      if (index === 0 || route.type !== "push") {
        // Save the previous group if it's not empty
        if (currentGroup.length > 0) {
          groups.push(currentGroup)
        }
        // Start a new group with this route
        currentGroup = [route]
      } else {
        // Add to the current group if it's a push route
        currentGroup.push(route)
      }
    })

    // Add the last group if it's not empty
    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }

    return groups
  }, [routes])

  return (
    <GroupedNavigationRouteContext.Provider value={routeGroups}>
      {routeGroups.map((group) => {
        const isPushGroup = group.at(0)?.type === "push"
        if (!isPushGroup) {
          return <ModalScreenStackItems key={group.at(0)?.id} routes={group} />
        }
        return <MapScreenStackItems key={group.at(0)?.id} routes={group} />
      })}
    </GroupedNavigationRouteContext.Provider>
  )
}

const MapScreenStackItems: FC<{
  routes: Route[]
}> = memo(({ routes }) => {
  return routes.map((route) => {
    return (
      <WrappedScreenItem
        stackPresentation={"push"}
        key={route.id}
        screenId={route.id}
        screenOptions={route.screenOptions}
      >
        <ResolveView comp={route.Component} element={route.element} props={route.props} />
      </WrappedScreenItem>
    )
  })
})

const ModalScreenStackItems: FC<{
  routes: Route[]
}> = memo(({ routes }) => {
  const rootModalRoute = routes.at(0)
  const modalScreenOptionsCtxValue = useMemo<PrimitiveAtom<ScreenOptionsContextType>>(
    () => atom({}),
    [],
  )

  const modalScreenOptions = useAtomValue(modalScreenOptionsCtxValue)

  if (!rootModalRoute) {
    return null
  }
  const isStackModal = rootModalRoute.type !== "formSheet"

  if (isStackModal) {
    return (
      <ModalScreenItemOptionsContext.Provider value={modalScreenOptionsCtxValue}>
        <WrappedScreenItem
          stackPresentation={rootModalRoute?.type}
          key={rootModalRoute.id}
          screenId={rootModalRoute.id}
          screenOptions={rootModalRoute.screenOptions}
          {...modalScreenOptions}
        >
          <ScreenStack style={StyleSheet.absoluteFill}>
            <WrappedScreenItem
              screenId={rootModalRoute.id}
              screenOptions={rootModalRoute.screenOptions}
            >
              <ResolveView
                comp={rootModalRoute.Component}
                element={rootModalRoute.element}
                props={rootModalRoute.props}
              />
            </WrappedScreenItem>
            {routes.slice(1).map((route) => {
              return (
                <WrappedScreenItem
                  stackPresentation={"push"}
                  key={route.id}
                  screenId={route.id}
                  screenOptions={route.screenOptions}
                >
                  <ResolveView comp={route.Component} element={route.element} props={route.props} />
                </WrappedScreenItem>
              )
            })}
          </ScreenStack>
        </WrappedScreenItem>
      </ModalScreenItemOptionsContext.Provider>
    )
  }
  return routes.map((route) => {
    return (
      <WrappedScreenItem
        key={route.id}
        screenId={route.id}
        stackPresentation={route.type}
        screenOptions={route.screenOptions}
      >
        <ResolveView comp={route.Component} element={route.element} props={route.props} />
      </WrappedScreenItem>
    )
  })
})

const ResolveView: FC<{
  comp?: NavigationControllerView<any>
  element?: React.ReactElement
  props?: unknown
}> = ({ comp: Component, element, props }) => {
  if (Component && typeof Component === "function") {
    return <Component {...(props as any)} />
  }
  if (element) {
    return element
  }
  throw new Error("No component or element provided")
}
