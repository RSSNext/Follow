import { AnimatePresence, m } from "framer-motion"
import { useEffect, useState } from "react"

export const IconScaleTransition = ({
  icon1,
  icon2,
  status,
}: {
  status: "init" | "done"

  icon1: string
  icon2: string
}) => {
  const [isMount, isMounted] = useState(false)
  useEffect(() => {
    isMounted(true)
    return () => {
      isMounted(false)
    }
  }, [])

  const initial = isMount ? { scale: 0 } : true
  return (
    <AnimatePresence mode="popLayout">
      {status === "init" ? (
        <m.i
          className={icon1}
          key="1"
          initial={initial}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      ) : (
        <m.i
          className={icon2}
          key="2"
          initial={initial}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      )}
    </AnimatePresence>
  )
}
