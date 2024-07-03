import "./styles/main.css"

import { ClickToComponent } from "click-to-react-component"
import * as React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { setAppIsReady } from "./atoms"
import { initializeApp } from "./init"
import { router } from "./router"

await initializeApp().finally(() => {
  setAppIsReady(true)
})

ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ClickToComponent />
  </React.StrictMode>,
)
