import { nextFrame } from "@renderer/lib/dom"
import { useLayoutEffect } from "react"

export const Component = () => {
  useLayoutEffect(() => {
    nextFrame(
      () => router.navigate("/settings/general"),
    )
  }, [])
  return null
}
