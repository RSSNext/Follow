"use dom"
import "@follow/components/assets/colors-media.css"
import "@follow/components/assets/tailwind.css"

import type { HtmlProps } from "@follow/components"
import { Html } from "@follow/components"

export default function HtmlWeb({
  content,
  dom,
  ...options
}: { dom?: import("expo/dom").DOMProps } & HtmlProps) {
  return <Html content={content} {...options} />
}
