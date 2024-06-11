import { createBrowserRouter } from "react-router-dom"

import App from "./App"
import { buildGlobRoutes } from "./lib/route-builder"

const globTree = import.meta.glob("./pages/**/*.tsx")
const tree = buildGlobRoutes(globTree)
// console.log(tree)

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: tree,
  },
])
