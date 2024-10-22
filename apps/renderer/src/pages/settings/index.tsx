import { nextFrame } from "@follow/utils/dom"
import { useLayoutEffect } from "react"

export const Component = () => {
  useLayoutEffect(() => {
    nextFrame(() => router.navigate("/settings/general"))
  }, [])
  return null
}
