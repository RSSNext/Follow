import { buildGlobRoutes } from "@follow/utils/route-builder"
import { wrapCreateBrowserRouter } from "@sentry/react"
import { createBrowserRouter, createHashRouter } from "react-router-dom"

// import { ErrorElement } from "./components/common/ErrorElement"
// import { NotFound } from "./components/common/NotFound"

const globTree = import.meta.glob("./pages/**/*.tsx")
const tree = buildGlobRoutes(globTree)

declare global {
  interface Window {
    SENTRY_RELEASE: string
    __DEBUG_PROXY__: boolean
  }
}
let routerCreator = window["__DEBUG_PROXY__"] ? createHashRouter : createBrowserRouter
if (window.SENTRY_RELEASE) {
  routerCreator = wrapCreateBrowserRouter(routerCreator)
}

export const router = routerCreator(
  [
    {
      path: "/",
      lazy: () => import("./App"),
      children: tree,
      // errorElement: <ErrorElement />,
    },
    // {
    //   path: "*",
    // element: <NotFound />,
    // },
  ],
  {
    // todo
    // basename: "/test",
  },
)
