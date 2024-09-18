import type { MotionProps } from "framer-motion"
import { m as M } from "framer-motion"
import { createElement, forwardRef } from "react"

import { useReduceMotion } from "~/hooks/biz/useReduceMotion"

const cacheMap = new Map<string, any>()
export const m: typeof M = new Proxy(M, {
  get(target, p: string) {
    const Component = target[p]

    if (cacheMap.has(p)) {
      return cacheMap.get(p)
    }
    const MotionComponent = forwardRef((props: MotionProps, ref) => {
      const shouldReduceMotion = useReduceMotion()
      const nextProps = { ...props }
      if (shouldReduceMotion) {
        if (props.exit) {
          nextProps.exit = {
            opacity: 0,
          }
        }

        if (props.initial) {
          nextProps.initial = {
            opacity: 0,
          }
        }
        nextProps.animate = {
          opacity: 1,
        }
      }

      return createElement(Component, { ...nextProps, ref })
    })

    cacheMap.set(p, MotionComponent)

    return MotionComponent
  },
})
