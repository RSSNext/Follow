import { createHashRouter } from "react-router-dom"

import App from "./App"
import { NotFound } from "./components/ui/not-found"
import { buildGlobRoutes } from "./lib/route-builder"

const globTree = import.meta.glob("./pages/**/*.tsx")
const tree = buildGlobRoutes(globTree)

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,

    children: tree,
  },
  {
    path: "*",
    element: <NotFound />,
  },
])
