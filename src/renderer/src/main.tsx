import "./styles/main.css"

import { ClickToComponent } from "click-to-react-component"
import * as React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { setAppIsReady } from "./atoms/app"
import { ElECTRON_CUSTOM_TITLEBAR_HEIGHT, ELECTRON_WINDOWS_RADIUS } from "./constants"
import { initializeApp } from "./initialize"
import { getOS } from "./lib/utils"
import { router } from "./router"

await initializeApp().finally(() => {
  setAppIsReady(true)
})

const $container = document.querySelector("#root") as HTMLElement

if (window.electron && getOS() === "Windows") {
  $container.style.borderRadius = `${ELECTRON_WINDOWS_RADIUS}px`
  $container.style.overflow = "hidden"
  $container.style.paddingTop = `${ElECTRON_CUSTOM_TITLEBAR_HEIGHT}px`
  $container.style.background = "var(--fo-background)"

  document.body.style.cssText += `--fo-window-padding-top: ${ElECTRON_CUSTOM_TITLEBAR_HEIGHT}px; --fo-window-radius: ${ELECTRON_WINDOWS_RADIUS}px;`
}
ReactDOM.createRoot($container).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ClickToComponent />
  </React.StrictMode>,
)
