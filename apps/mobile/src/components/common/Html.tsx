"use dom"
import "../../../../../packages/components/assets/colors-media.css"
import "../../../../../packages/components/assets/tailwind.css"

import { Html } from "@follow/components"

// eslint-disable-next-line no-empty-pattern
export default function HtmlRender({}: { dom?: import("expo/dom").DOMProps }) {
  return <Html content="<div>hi</div>" />
}
