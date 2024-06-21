import { cn } from "@renderer/lib/utils"
import type { Spring } from "framer-motion"
import { m } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const softSpringPreset: Spring = {
  duration: 0.35,
  type: "spring",
  stiffness: 120,
  damping: 20,
}

interface AnimateChangeInHeightProps {
  children: React.ReactNode
  className?: string
  duration?: number

  spring?: boolean
}

export const AutoResizeHeight: React.FC<AnimateChangeInHeightProps> = ({
  children,
  className,
  duration = 0.6,
  spring = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number | "auto">("auto")

  useEffect(() => {
    if (!containerRef.current) return
    const resizeObserver = new ResizeObserver((entries) => {
      // We only have one entry, so we can use entries[0].
      const observedHeight = entries[0].contentRect.height
      // add margin top
      setHeight(observedHeight)
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      // Cleanup the observer when the component is unmounted
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <m.div
      className={cn("overflow-hidden", className)}
      style={{ height }}
      initial={false}
      animate={{ height }}
      transition={spring ? softSpringPreset : { duration }}
    >
      <div ref={containerRef}>{children}</div>
    </m.div>
  )
}
