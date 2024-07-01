import type { MotionProps } from "framer-motion"
import { m as M } from "framer-motion"
import { createElement, forwardRef } from "react"

const cacheMap = new Map<string, any>()
export const m: typeof M = new Proxy(M, {
  get(target, p: string) {
    const Component = target[p]

    if (cacheMap.has(p)) {
      return cacheMap.get(p)
    }
    const MotionComponent = forwardRef((props: MotionProps, ref) => {
      const nextProps = { ...props }

      if (props.exit) {
        delete nextProps.exit
      }

      if (props.initial) {
        nextProps.initial = true
      }

      return createElement(Component, { ...nextProps, ref })
    })

    cacheMap.set(p, MotionComponent)

    return MotionComponent
  },
})
