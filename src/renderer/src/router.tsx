import { createBrowserRouter } from "react-router-dom"

import App from "./App"
import { convertGlobToRoutes } from "./lib/route-builder"

const globTree = import.meta.glob("./pages/**/*.{tsx,jsx}")
const tree = convertGlobToRoutes(globTree)
// console.log(tree)

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: tree,
  },
])
