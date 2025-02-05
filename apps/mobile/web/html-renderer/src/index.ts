import "@follow/components/tailwind"

import { createElement } from "react"
import { createRoot } from "react-dom/client"

import { HTML } from "./App"

const root = document.querySelector("#root")

if (root) {
  createRoot(root).render(
    createElement(HTML, {
      children: "Hello",
      as: "div",
    }),
  )
}
