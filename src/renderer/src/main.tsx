import "./styles/main.css"

import { env } from "@env"
import { authConfigManager } from "@hono/auth-js/react"
import { ClickToComponent } from "click-to-react-component"
import * as React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { setAppIsReady } from "./atoms/app"
import { ElECTRON_CUSTOM_TITLEBAR_HEIGHT } from "./constants"
import { initializeApp } from "./initialize"
import { getOS } from "./lib/utils"
import { router } from "./router"

// Initialize the auth config
authConfigManager.setConfig({
  baseUrl: env.VITE_API_URL,
  basePath: "/auth",
  credentials: "include",
})

initializeApp().finally(() => {
  setAppIsReady(true)
})

const $container = document.querySelector("#root") as HTMLElement

if (window.electron && getOS() === "Windows") {
  document.body.style.cssText += `--fo-window-padding-top: ${ElECTRON_CUSTOM_TITLEBAR_HEIGHT}px;`
}
ReactDOM.createRoot($container).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ClickToComponent editor="cursor" />
  </React.StrictMode>,
)
