import { useIsomorphicLayoutEffect } from "foxact/use-isomorphic-layout-effect"
import { throttle } from "lodash-es"
import type { FC } from "react"

import { viewportAtom } from "~/atoms/viewport"
import { jotaiStore } from "~/lib/jotai"

export const EventProvider: FC = () => {
  useIsomorphicLayoutEffect(() => {
    const readViewport = throttle(() => {
      const { innerWidth: w, innerHeight: h } = window
      const sm = w >= 640
      const md = w >= 768
      const lg = w >= 1024
      const xl = w >= 1280
      const _2xl = w >= 1536
      jotaiStore.set(viewportAtom, {
        sm,
        md,
        lg,
        xl,
        "2xl": _2xl,
        h,
        w,
      })
    }, 16)

    readViewport()

    window.addEventListener("resize", readViewport)
    return () => {
      window.removeEventListener("resize", readViewport)
    }
  }, [])

  return null
}
