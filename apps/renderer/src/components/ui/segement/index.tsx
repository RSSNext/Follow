import { m } from "framer-motion"
import type { ReactNode } from "react"
import { useId, useMemo, useState } from "react"
import { useContextSelector } from "use-context-selector"

import { cn } from "~/lib/utils"

import { SegmentGroupContext } from "./ctx"

interface SegmentGroupProps {
  value?: string
  onValueChanged?: (value: string) => void
}
export const SegmentGroup = (props: ComponentType<SegmentGroupProps>) => {
  const { onValueChanged, value, className } = props

  const [currentValue, setCurrentValue] = useState(value || "")
  const componentId = useId()

  return (
    <SegmentGroupContext.Provider
      value={useMemo(
        () => ({
          value: currentValue,
          setValue: (value) => {
            setCurrentValue(value)
            onValueChanged?.(value)
          },
          componentId,
        }),
        [componentId, currentValue, onValueChanged],
      )}
    >
      <div
        role="tablist"
        className={cn(
          "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground outline-none",
          className,
        )}
        tabIndex={0}
        data-orientation="horizontal"
      >
        {props.children}
      </div>
    </SegmentGroupContext.Provider>
  )
}

export const SegmentItem: Component<{
  value: string
  label: ReactNode
}> = ({ label, value, className }) => {
  const isActive = useContextSelector(SegmentGroupContext, (v) => v.value === value)
  const setValue = useContextSelector(SegmentGroupContext, (v) => v.setValue)
  const layoutId = useContextSelector(SegmentGroupContext, (v) => v.componentId)
  return (
    <button
      type="button"
      role="tab"
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap px-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground",
        "h-full rounded-md focus-visible:ring-accent/30",
        className,
      )}
      tabIndex={-1}
      data-orientation="horizontal"
      onClick={() => {
        setValue(value)
      }}
      data-state={isActive ? "active" : "inactive"}
    >
      <span className="z-[1]">{label}</span>

      {isActive && (
        <m.span
          layout
          layoutId={layoutId}
          className="absolute inset-0 z-0 rounded-md bg-background shadow"
        />
      )}
    </button>
  )
}
