import { useLayoutEffect } from "react"

import { nextFrame } from "~/lib/dom"

export const Component = () => {
  useLayoutEffect(() => {
    nextFrame(() => router.navigate("/settings/general"))
  }, [])
  return null
}
