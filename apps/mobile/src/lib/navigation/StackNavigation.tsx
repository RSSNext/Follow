import { atom, useAtomValue } from "jotai"
import type { FC } from "react"
import { memo, useContext, useMemo } from "react"
import { StyleSheet, View } from "react-native"
import type { StackPresentationTypes } from "react-native-screens"
import { ScreenContainer, ScreenStack, ScreenStackItem } from "react-native-screens"

import type { Route } from "./ChainNavigationContext"
import { ChainNavigationContext } from "./ChainNavigationContext"
import { Navigation } from "./Navigation"
import { NavigationInstanceContext, useNavigation } from "./NavigationInstanceContext"
import type { NavigationControllerView } from "./types"

export const RootStackNavigation = ({ children }: { children: React.ReactNode }) => {
  const chainCtxValue = useMemo(
    () => ({
      routesAtom: atom<Route[]>([]),
    }),
    [],
  )

  const navigation = useMemo(() => {
    const navigation = new Navigation(chainCtxValue)
    Navigation.setRootShared(navigation)
    return navigation
  }, [chainCtxValue])

  return (
    <ChainNavigationContext.Provider value={chainCtxValue}>
      <NavigationInstanceContext.Provider value={navigation}>
        <ScreenStack style={StyleSheet.absoluteFill}>
          <ScreenStackItem screenId="root" style={StyleSheet.absoluteFill}>
            {children}
          </ScreenStackItem>

          <ScreenItemsMapper />
        </ScreenStack>
      </NavigationInstanceContext.Provider>
    </ChainNavigationContext.Provider>
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

  // TODO remove this
  // eslint-disable-next-line no-console
  console.log(routeGroups)

  return routeGroups.map((group) => {
    const isPushGroup = group.at(0)?.type === "push"
    if (!isPushGroup) {
      return <ModalScreenStackItems key={group.at(0)?.id} routes={group} />
    }
    return <MapScreenStackItems key={group.at(0)?.id} routes={group} />
  })
}

const MapScreenStackItems: FC<{
  routes: Route[]
}> = ({ routes }) => {
  return routes.map((route) => {
    return (
      <WrappedScreenItem stackPresentation={"push"} key={route.id} routeId={route.id}>
        <ResolveView comp={route.Component} element={route.element} />
      </WrappedScreenItem>
    )
  })
}

const ModalScreenStackItems: FC<{
  routes: Route[]
}> = ({ routes }) => {
  // TODO Only formSheet is supported for stack modal
  const rootModalRoute = routes.at(0)
  if (!rootModalRoute) {
    return null
  }
  const isStackModal = rootModalRoute.type !== "formSheet"
  if (isStackModal) {
    return (
      <WrappedScreenItem
        stackPresentation={rootModalRoute?.type}
        key={rootModalRoute.id}
        routeId={rootModalRoute.id}
      >
        <ScreenStack style={StyleSheet.absoluteFill}>
          <WrappedScreenItem routeId={rootModalRoute.id}>
            <ResolveView comp={rootModalRoute.Component} element={rootModalRoute.element} />
          </WrappedScreenItem>
          {routes.slice(1).map((route) => {
            return (
              <WrappedScreenItem stackPresentation={"push"} key={route.id} routeId={route.id}>
                <ResolveView comp={route.Component} element={route.element} />
              </WrappedScreenItem>
            )
          })}
        </ScreenStack>
      </WrappedScreenItem>
    )
  }
  return routes.map((route) => {
    return (
      <WrappedScreenItem key={route.id} routeId={route.id} stackPresentation={"formSheet"}>
        <ResolveView comp={route.Component} element={route.element} />
      </WrappedScreenItem>
    )
  })
}

const WrappedScreenItem: FC<{
  routeId: string
  children: React.ReactNode
  stackPresentation?: StackPresentationTypes
}> = memo(({ routeId, children, stackPresentation }) => {
  const navigation = useNavigation()
  return (
    <ScreenStackItem
      key={routeId}
      screenId={routeId}
      stackPresentation={stackPresentation}
      style={StyleSheet.absoluteFill}
      onDismissed={() => {
        navigation.__internal_dismiss(routeId)
      }}
    >
      {children}
    </ScreenStackItem>
  )
})
const ResolveView: FC<{
  comp?: NavigationControllerView<any>
  element?: React.ReactElement
}> = ({ comp: Component, element }) => {
  if (Component && typeof Component === "function") {
    return <Component />
  }
  if (element) {
    return element
  }
  throw new Error("No component or element provided")
}
