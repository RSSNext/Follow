"use dom"
import "../../../../../packages/components/assets/colors-media.css"
import "../../../../../packages/components/assets/tailwind.css"

import type { HtmlProps } from "@follow/components"
import { Html } from "@follow/components"

export default function HtmlRender({
  content,
  dom,
  ...options
}: { dom?: import("expo/dom").DOMProps } & HtmlProps) {
  return <Html content={content} {...options} />
}
