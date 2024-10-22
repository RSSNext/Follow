import { IN_ELECTRON } from "@follow/shared/constants"
import { buildGlobRoutes } from "@follow/utils/route-builder"
import { wrapCreateBrowserRouter } from "@sentry/react"
import { createBrowserRouter, createHashRouter } from "react-router-dom"

import { ErrorElement } from "./components/common/ErrorElement"
import { NotFound } from "./components/common/NotFound"

const globTree = import.meta.glob("./pages/**/*.tsx")
const tree = buildGlobRoutes(globTree)

let routerCreator =
  IN_ELECTRON || globalThis["__DEBUG_PROXY__"] ? createHashRouter : createBrowserRouter
if (window.SENTRY_RELEASE) {
  routerCreator = wrapCreateBrowserRouter(routerCreator)
}

export const router = routerCreator([
  {
    path: "/",
    lazy: () => import("./App"),
    children: tree,
    errorElement: <ErrorElement />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
])
