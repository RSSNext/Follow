import { cn } from "@renderer/lib/utils"
import type { Variants } from "framer-motion"
import { AnimatePresence, m } from "framer-motion"
import * as React from "react"

import { microReboundPreset } from "../constants/spring"

interface CollapseProps {
  title: React.ReactNode
}
export const Collapse: Component<CollapseProps> = (props) => {
  const [isOpened, setIsOpened] = React.useState(false)
  return (
    <CollapseControlled
      isOpened={isOpened}
      onOpenChange={setIsOpened}
      {...props}
    />
  )
}

export const CollapseControlled: Component<
  {
    isOpened: boolean
    onOpenChange: (v: boolean) => void
  } & CollapseProps
> = (props) => (
  <div
    className={cn("flex flex-col", props.className)}
    data-state={props.isOpened ? "open" : "hidden"}
  >
    <div
      className="relative flex w-full cursor-pointer items-center justify-between"
      onClick={() => props.onOpenChange(!props.isOpened)}
    >
      <span className="w-0 shrink grow truncate">{props.title}</span>
      <div className="shrink-0 text-gray-400">
        <i
          className={cn(
            "i-mingcute-down-line duration-200",
            props.isOpened ? "rotate-180" : "",
          )}
        />
      </div>
    </div>
    <CollapseContent isOpened={props.isOpened}>
      {props.children}
    </CollapseContent>
  </div>
)
export const CollapseContent: Component<{
  isOpened: boolean
  withBackground?: boolean
}> = ({ isOpened, className, children }) => {
  const variants = React.useMemo(() => {
    const v = {
      open: {
        opacity: 1,
        height: "auto",
        transition: microReboundPreset,
      },
      collapsed: {
        opacity: 0,
        height: 0,
        overflow: "hidden",
      },
    } satisfies Variants

    return v
  }, [])
  return (
    <>
      <AnimatePresence initial={false}>
        {isOpened && (
          <m.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={variants}
            className={className}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
