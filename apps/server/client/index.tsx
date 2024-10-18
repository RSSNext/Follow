import "@follow/components/tailwind"
import "./styles/index.css"
import "@follow/components/dayjs"

// @ts-expect-error
import { ClickToComponent } from "click-to-react-component"
import * as React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { initI18n } from "./i18n"
import { router } from "./router"

const $container = document.querySelector("#root") as HTMLElement
initI18n()

ReactDOM.createRoot($container).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ClickToComponent editor="cursor" />
  </React.StrictMode>,
)
