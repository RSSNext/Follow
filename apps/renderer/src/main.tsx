import "./wdyr"
import "@follow/components/tailwind"
import "@follow/components/dayjs"
import "./styles/main.css"

import { IN_ELECTRON } from "@follow/shared/constants"
import { getOS } from "@follow/utils/utils"
import { ClickToComponent } from "click-to-react-component"
import * as React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { setAppIsReady } from "./atoms/app"
import { ElECTRON_CUSTOM_TITLEBAR_HEIGHT } from "./constants"
import { initializeApp } from "./initialize"
import { router } from "./router"

initializeApp().finally(() => {
  setAppIsReady(true)
})

const $container = document.querySelector("#root") as HTMLElement

if (IN_ELECTRON && getOS() === "Windows") {
  document.body.style.cssText += `--fo-window-padding-top: ${ElECTRON_CUSTOM_TITLEBAR_HEIGHT}px;`
}

ReactDOM.createRoot($container).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ClickToComponent editor="cursor" />
  </React.StrictMode>,
)
