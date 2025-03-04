import { throttle } from "es-toolkit/compat"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useLayoutEffect, useRef, useState } from "react"

import { APP_GRID_CONTAINER_ID } from "~/constants/dom"

const AppLayoutGridContainerWidthContext = createContext<number>(0)

export const AppLayoutGridContainerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const $first = ref.current?.firstElementChild
    if (!$first) return
    const handler = throttle(() => {
      if (!$first) return

      const { width } = $first.getBoundingClientRect()
      setWidth(width)
    }, 100)

    handler()

    const resizeObserver = new ResizeObserver(handler)
    resizeObserver.observe($first)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <AppLayoutGridContainerWidthContext.Provider value={width}>
      <div ref={ref} className="relative z-0 contents" id={APP_GRID_CONTAINER_ID}>
        {children}
      </div>
    </AppLayoutGridContainerWidthContext.Provider>
  )
}

export const useAppLayoutGridContainerWidth = () => useContext(AppLayoutGridContainerWidthContext)
