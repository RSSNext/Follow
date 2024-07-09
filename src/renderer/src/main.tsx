import "./styles/main.css"

import { ClickToComponent } from "click-to-react-component"
import * as React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { setAppIsReady } from "./atoms/app"
import { AppErrorBoundary } from "./components/common/AppErrorBoundary"
import { initializeApp } from "./init"
import { getOS } from "./lib/utils"
import { router } from "./router"

await initializeApp().finally(() => {
  setAppIsReady(true)
})

const $container = document.querySelector("#root") as HTMLElement

if (window.electron && getOS() === "Windows") {
  $container.style.borderRadius = "12px"
  $container.style.overflow = "hidden"
  $container.style.paddingTop = "24px"
}
ReactDOM.createRoot($container).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
    <ClickToComponent />
  </React.StrictMode>,
)
