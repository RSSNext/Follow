import { ClickToComponent } from "click-to-react-component"
import * as React from "react"
import ReactDOM from "react-dom/client"

const $container = document.querySelector("#root") as HTMLElement

ReactDOM.createRoot($container).render(
  <React.StrictMode>
    <div>222222222xxxxxaaaaaaaaaaaaaaa2222</div>
    <ClickToComponent editor="cursor" />
  </React.StrictMode>,
)
