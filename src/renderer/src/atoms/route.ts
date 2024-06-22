import { createAtomHooks } from "@renderer/lib/jotai"
import { atom, useAtomValue } from "jotai"
import { selectAtom } from "jotai/utils"
import { useMemo } from "react"
import type { NavigateFunction, Params } from "react-router-dom"

interface RouteAtom {
  params: Readonly<Params<string>>
  searchParams: URLSearchParams
}

export const [routeAtom, , , , getReadonlyRoute, setRoute] = createAtomHooks(
  atom<RouteAtom>({
    params: {},
    searchParams: new URLSearchParams(),
  }),
)

const noop = []
export const useReadonlyRouteSelector = <T>(
  selector: (route: RouteAtom) => T,
  deps: any[] = noop,
): T =>
    useAtomValue(
      useMemo(() => selectAtom(routeAtom, (route) => selector(route)), deps),
    )

// VITE HMR will create new router instance, but RouterProvider always stable

const [, , , , navigate, setNavigate] = createAtomHooks(
  atom<{ fn: NavigateFunction | null }>({ fn() {} }),
)
const getStableRouterNavigate = () => navigate().fn
export {
  getStableRouterNavigate,
  setNavigate,
}
