import { m } from "@renderer/components/common/Motion"
import { cn } from "@renderer/lib/utils"
import type { Variants } from "framer-motion"
import { AnimatePresence } from "framer-motion"
import { useCallback, useRef, useState } from "react"

import { MotionButtonBase } from "../button"

const copyIconVariants: Variants = {
  initial: {
    opacity: 1,
    scale: 1,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0,
  },
}

export const CopyButton: Component<{
  value: string
}> = ({ value, className }) => {
  const [copied, setCopied] = useState(false)
  const copiedTimerRef = useRef<any>()
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    setCopied(true)

    clearTimeout(copiedTimerRef.current)
    copiedTimerRef.current = setTimeout(() => {
      setCopied(false)
    }, 2000)
  }, [value])
  return (
    <MotionButtonBase
      type="button"
      onClick={handleCopy}
      className={cn(
        "center flex text-xs",
        "rounded-md border border-theme-accent/5 bg-theme-accent/80 p-1.5 text-white backdrop-blur duration-200",

        className,
      )}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <m.i
            key="copied"
            className="i-mgc-check-filled size-4"
            {...copyIconVariants}
          />
        ) : (
          <m.i
            key="copy"
            className="i-mgc-copy-2-cute-re size-4"
            {...copyIconVariants}
          />
        )}
      </AnimatePresence>
    </MotionButtonBase>
  )
}
