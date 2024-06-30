import "./styles/main.css"

import { authConfigManager } from "@hono/auth-js/react"
import { ClickToComponent } from "click-to-react-component"
import { enableMapSet } from "immer"
import * as React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { router } from "./router"
import { initializeDbAndStore } from "./store/utils/init"

enableMapSet()
initializeDbAndStore().finally(render)

authConfigManager.setConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  basePath: "/auth",
  credentials: "include",
})

function render() {
  ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
      <ClickToComponent />
    </React.StrictMode>,
  )
}
