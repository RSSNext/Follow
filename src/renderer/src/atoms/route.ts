/* eslint-disable unicorn/no-unreadable-array-destructuring */
import { createAtomHooks } from "@renderer/lib/jotai"
import { atom, useAtomValue } from "jotai"
import { selectAtom } from "jotai/utils"
import { useMemo } from "react"
import type { Params } from "react-router-dom"

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

export const useReadonlyRouteSelector = <T>(
  selector: (route: RouteAtom) => T,
): T =>
    useAtomValue(
      useMemo(() => selectAtom(routeAtom, (route) => selector(route)), []),
    )
