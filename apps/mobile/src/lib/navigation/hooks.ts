import { useContext } from "react"

import { GroupedNavigationRouteContext } from "./GroupedNavigationRouteContext"
import { NavigationInstanceContext } from "./NavigationInstanceContext"
import { ScreenItemContext } from "./ScreenItemContext"

export const useCanBack = () => {
  const { screenId } = useContext(ScreenItemContext)

  const routeGroups = useContext(GroupedNavigationRouteContext)
  if (!routeGroups) return false

  const routeGroup = routeGroups.find((group) => group.some((r) => r.id === screenId))
  if (!routeGroup) return false

  if (routeGroup.length === 1) return false
  // If routeGroup is M, P, P and current route is P, then we can back
  return routeGroup.findIndex((r) => r.id === screenId) > 0
}

/**
 * If screen present as a modal, then we can dismiss it.
 */
export const useCanDismiss = () => {
  const { screenId } = useContext(ScreenItemContext)

  const routeGroups = useContext(GroupedNavigationRouteContext)
  if (!routeGroups) return false

  const routeGroup = routeGroups.find((group) => group.some((r) => r.id === screenId))
  if (!routeGroup || routeGroup.length === 0) return false

  return routeGroup.at(0)?.type !== "push"
}

export const useNavigation = () => {
  const navigation = useContext(NavigationInstanceContext)
  if (!navigation) {
    throw new Error("Navigation not found")
  }
  return navigation
}

export const useScreenIsInModal = useCanDismiss
