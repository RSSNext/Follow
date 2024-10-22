import { viewportAtom } from "@follow/components/atoms/viewport.js"
import { useIsomorphicLayoutEffect } from "foxact/use-isomorphic-layout-effect"
import { useStore } from "jotai"
import { throttle } from "lodash-es"
import type { FC } from "react"

export const EventProvider: FC = () => {
  const store = useStore()
  useIsomorphicLayoutEffect(() => {
    const readViewport = throttle(() => {
      const { innerWidth: w, innerHeight: h } = window
      const sm = w >= 640
      const md = w >= 768
      const lg = w >= 1024
      const xl = w >= 1280
      const _2xl = w >= 1536
      store.set(viewportAtom, {
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
