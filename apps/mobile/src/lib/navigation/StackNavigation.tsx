import { atom, useAtomValue, useSetAtom } from "jotai"
import type { FC } from "react"
import { memo, useContext, useMemo } from "react"
import { StyleSheet } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import { SafeAreaProvider } from "react-native-safe-area-context"
import type { ScreenStackHeaderConfigProps, StackPresentationTypes } from "react-native-screens"
import { ScreenStack, ScreenStackItem } from "react-native-screens"

import { PortalHost } from "@/src/components/ui/portal"

import { useCombinedLifecycleEvents } from "./__internal/hooks"
import type { Route } from "./ChainNavigationContext"
import { ChainNavigationContext } from "./ChainNavigationContext"
import { defaultHeaderConfig } from "./config"
import { GroupedNavigationRouteContext } from "./GroupedNavigationRouteContext"
import { Navigation } from "./Navigation"
import { NavigationInstanceContext, useNavigation } from "./NavigationInstanceContext"
import { ScreenItemContext } from "./ScreenItemContext"
import type { NavigationControllerView } from "./types"

interface RootStackNavigationProps {
  children: React.ReactNode

  headerConfig?: ScreenStackHeaderConfigProps
}
export const RootStackNavigation = ({ children, headerConfig }: RootStackNavigationProps) => {
  return (
    <SafeAreaProvider>
      <ChainNavigationContext.Provider value={Navigation.rootNavigation.__internal_getCtxValue()}>
        <NavigationInstanceContext.Provider value={Navigation.rootNavigation}>
          <ScreenStack style={StyleSheet.absoluteFill}>
            <WrappedScreenItem headerConfig={headerConfig} screenId="root">
              {children}
            </WrappedScreenItem>

            <ScreenItemsMapper />
          </ScreenStack>
        </NavigationInstanceContext.Provider>
      </ChainNavigationContext.Provider>
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
      <WrappedScreenItem stackPresentation={"push"} key={route.id} screenId={route.id}>
        <ResolveView comp={route.Component} element={route.element} props={route.props} />
      </WrappedScreenItem>
    )
  })
})

const ModalScreenStackItems: FC<{
  routes: Route[]
}> = memo(({ routes }) => {
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
        screenId={rootModalRoute.id}
      >
        <ScreenStack style={StyleSheet.absoluteFill}>
          <WrappedScreenItem screenId={rootModalRoute.id}>
            <ResolveView
              comp={rootModalRoute.Component}
              element={rootModalRoute.element}
              props={rootModalRoute.props}
            />
          </WrappedScreenItem>
          {routes.slice(1).map((route) => {
            return (
              <WrappedScreenItem stackPresentation={"push"} key={route.id} screenId={route.id}>
                <ResolveView comp={route.Component} element={route.element} props={route.props} />
              </WrappedScreenItem>
            )
          })}
        </ScreenStack>
      </WrappedScreenItem>
    )
  }
  return routes.map((route) => {
    return (
      <WrappedScreenItem key={route.id} screenId={route.id} stackPresentation={"formSheet"}>
        <ResolveView comp={route.Component} element={route.element} props={route.props} />
      </WrappedScreenItem>
    )
  })
})

const WrappedScreenItem: FC<{
  screenId: string
  children: React.ReactNode
  stackPresentation?: StackPresentationTypes

  headerConfig?: ScreenStackHeaderConfigProps
}> = memo(({ screenId, children, stackPresentation, headerConfig }) => {
  const navigation = useNavigation()
  const reAnimatedScrollY = useSharedValue(0)
  const ctxValue = useMemo(
    () => ({
      screenId,
      isFocusedAtom: atom(false),
      isAppearedAtom: atom(false),
      isDisappearedAtom: atom(false),
      reAnimatedScrollY,
    }),
    [screenId, reAnimatedScrollY],
  )
  const setIsFocused = useSetAtom(ctxValue.isFocusedAtom)
  const setIsAppeared = useSetAtom(ctxValue.isAppearedAtom)
  const setIsDisappeared = useSetAtom(ctxValue.isDisappearedAtom)

  const combinedLifecycleEvents = useCombinedLifecycleEvents(ctxValue.screenId, {
    onAppear: () => {
      setIsFocused(true)
      setIsAppeared(true)
      setIsDisappeared(false)
    },
    onDisappear: () => {
      setIsFocused(false)
      setIsAppeared(false)
      setIsDisappeared(true)
    },
    onWillAppear: () => {
      setIsFocused(false)
      setIsAppeared(true)
      setIsDisappeared(false)
    },
    onWillDisappear: () => {
      setIsFocused(false)
      setIsAppeared(false)
      setIsDisappeared(true)
    },
  })
  return (
    <ScreenItemContext.Provider value={ctxValue}>
      <ScreenStackItem
        {...combinedLifecycleEvents}
        headerConfig={{
          ...defaultHeaderConfig,
          ...headerConfig,
        }}
        key={screenId}
        screenId={screenId}
        stackPresentation={stackPresentation}
        style={StyleSheet.absoluteFill}
        onDismissed={() => {
          navigation.__internal_dismiss(screenId)
        }}
      >
        <PortalHost>{children}</PortalHost>
      </ScreenStackItem>
    </ScreenItemContext.Provider>
  )
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
