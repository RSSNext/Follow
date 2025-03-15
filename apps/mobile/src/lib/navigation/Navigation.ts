import { jotaiStore } from "@follow/utils"

import type { ChainNavigationContextType, Route } from "./ChainNavigationContext"
import type { NavigationControllerView, NavigationControllerViewType } from "./types"

export class Navigation {
  private ctxValue: ChainNavigationContextType
  constructor(ctxValue: ChainNavigationContextType) {
    this.ctxValue = ctxValue
  }

  private viewIdCounter = 0

  private static shared: Navigation | null = null

  public static setRootShared(navigation: Navigation) {
    this.shared = navigation
  }

  public static getRootShared() {
    if (!this.shared) {
      throw new Error("Navigation not found")
    }
    return this.shared
  }

  private __push(route: Route) {
    const routes = jotaiStore.get(this.ctxValue.routesAtom)
    const hasRoute = routes.some((r) => r.id === route.id)
    if (hasRoute && routes.at(-1)?.id === route.id) {
      console.warn(`Top of stack is already ${route.id}`)
      return
    } else if (hasRoute) {
      route.id = `${route.id}-${this.viewIdCounter++}`
    }
    jotaiStore.set(this.ctxValue.routesAtom, [...routes, route])
  }
  pushControllerView<T>(view: NavigationControllerView<T>) {
    const viewId = view.id ?? view.name ?? `view-${this.viewIdCounter++}`

    this.__push({
      id: viewId,
      type: "push",
      Component: view,
    })
  }

  presentControllerView<T>(
    view: NavigationControllerView<T>,
    type: Exclude<NavigationControllerViewType, "push"> = "modal",
  ) {
    const viewId = view.id ?? view.name ?? `view-${this.viewIdCounter++}`
    this.__push({
      id: viewId,
      type,
      Component: view,
    })
  }
  __pop() {
    const routes = jotaiStore.get(this.ctxValue.routesAtom)
    const lastRoute = routes.at(-1)
    if (!lastRoute) {
      return
    }
    jotaiStore.set(this.ctxValue.routesAtom, routes.slice(0, -1))
  }
  /**
   * Dismiss the current modal.
   */
  dismiss() {
    const routes = jotaiStore.get(this.ctxValue.routesAtom)
    const lastModalIndex = routes.findLastIndex((r) => r.type === "modal")
    if (lastModalIndex === -1) {
      return
    }
    jotaiStore.set(this.ctxValue.routesAtom, routes.slice(0, lastModalIndex))
  }

  back() {
    return this.__pop()
  }

  __internal_dismiss(routeId: string) {
    const routes = jotaiStore.get(this.ctxValue.routesAtom)
    const lastModalIndex = routes.findLastIndex((r) => r.id === routeId)
    if (lastModalIndex === -1) {
      return
    }
    jotaiStore.set(this.ctxValue.routesAtom, routes.slice(0, lastModalIndex))
  }
}
