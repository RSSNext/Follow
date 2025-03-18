import { jotaiStore } from "@follow/utils"
import { EventEmitter } from "expo"
import { atom } from "jotai"
import { DeviceEventEmitter } from "react-native"

import type { ChainNavigationContextType, Route } from "./ChainNavigationContext"
import type { NavigationControllerView, NavigationControllerViewType } from "./types"

export class Navigation {
  private ctxValue: ChainNavigationContextType
  constructor(ctxValue: ChainNavigationContextType) {
    this.ctxValue = ctxValue
  }

  __internal_getCtxValue() {
    return this.ctxValue
  }

  private viewIdCounter = 0

  static readonly rootNavigation: Navigation = new Navigation({
    routesAtom: atom<Route[]>([]),
  })

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

  pushControllerView<T>(view: NavigationControllerView<T>, props?: T) {
    const viewId = view.id ?? view.name ?? `view-${this.viewIdCounter++}`

    this.__push({
      id: viewId,
      type: "push",
      Component: view,
      props,
    })
  }

  presentControllerView<T>(
    view: NavigationControllerView<T>,
    props?: T,
    type: Exclude<NavigationControllerViewType, "push"> = "modal",
  ) {
    const viewId = view.id ?? view.name ?? `view-${this.viewIdCounter++}`
    this.__push({
      id: viewId,
      type,
      Component: view,
      props,
    })
  }
  private __pop() {
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

  // eslint-disable-next-line unicorn/prefer-event-target
  private bus = new EventEmitter<{
    willAppear: (payload: LifecycleEventPayload) => void
    didAppear: (payload: LifecycleEventPayload) => void
    willDisappear: (payload: LifecycleEventPayload) => void
    didDisappear: (payload: LifecycleEventPayload) => void
  }>()
  on(event: "willAppear", callback: (payload: LifecycleEventPayload) => void): Disposer
  on(event: "didAppear", callback: (payload: LifecycleEventPayload) => void): Disposer
  on(event: "willDisappear", callback: (payload: LifecycleEventPayload) => void): Disposer
  on(event: "didDisappear", callback: (payload: LifecycleEventPayload) => void): Disposer
  on(event: string, callback: (payload: LifecycleEventPayload) => void): Disposer {
    const subscription = this.bus.addListener(event as any, callback)
    return () => {
      subscription.remove()
    }
  }

  emit(event: "willAppear", payload: LifecycleEventPayload): void
  emit(event: "didAppear", payload: LifecycleEventPayload): void
  emit(event: "willDisappear", payload: LifecycleEventPayload): void
  emit(event: "didDisappear", payload: LifecycleEventPayload): void
  emit(event: string, payload: LifecycleEventPayload): void {
    this.bus.emit(event as any, payload)
  }

  canGoBack() {
    const routes = jotaiStore.get(this.ctxValue.routesAtom)
    return routes.length > 0
  }
}

type Disposer = () => void

type LifecycleEventPayload = {
  screenId: string
}
