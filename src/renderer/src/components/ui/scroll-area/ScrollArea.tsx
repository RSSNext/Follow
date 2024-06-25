import * as ScrollAreaBase from "@radix-ui/react-scroll-area"
import { stopPropagation } from "@renderer/lib/dom"
import { cn } from "@renderer/lib/utils"
import * as React from "react"

import { useMaskScrollArea } from "./useMaskScrollArea"

const Corner = React.forwardRef<
  React.ElementRef<typeof ScrollAreaBase.Corner>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Corner>
>(({ className, ...rest }, forwardedRef) => (
  <ScrollAreaBase.Corner
    {...rest}
    ref={forwardedRef}
    className={cn("bg-theme-accent", className)}
  />
))

Corner.displayName = "ScrollArea.Corner"

const Thumb = React.forwardRef<
  React.ElementRef<typeof ScrollAreaBase.Thumb>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Thumb>
>(({ className, ...rest }, forwardedRef) => (
  <ScrollAreaBase.Thumb
    {...rest}
    ref={forwardedRef}
    className={cn(
      "relative w-full flex-1 rounded-xl transition-colors duration-150",
      "bg-gray-300 hover:bg-theme-accent/80 dark:bg-neutral-500",
      "active:bg-theme-accent-50/50",
      "before:absolute before:-left-1/2 before:-top-1/2 before:h-full before:min-h-[44]",
      "before:w-full before:min-w-[44] before:-translate-x-full before:-translate-y-full before:content-[\"\"]",
      className,
    )}
  />
))
Thumb.displayName = "ScrollArea.Thumb"

export const Scrollbar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaBase.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Scrollbar>
>(({ className, children, ...rest }, forwardedRef) => {
  const { orientation = "vertical" } = rest
  return (
    <ScrollAreaBase.Scrollbar
      {...rest}
      ref={forwardedRef}
      className={cn(
        "z-[10000] flex w-2.5 touch-none select-none p-0.5",
        orientation === "horizontal" ?
          `h-2.5 w-full flex-col` :
          `w-2.5 flex-row`,
        className,
      )}
    >
      {children}
      <Thumb />
    </ScrollAreaBase.Scrollbar>
  )
})
Scrollbar.displayName = "ScrollArea.Scrollbar"

export const Viewport = React.forwardRef<
  React.ElementRef<typeof ScrollAreaBase.Viewport>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Viewport>
>(({ className, ...rest }, forwardedRef) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [, maskClassName] = useMaskScrollArea({
    ref,
    size: "lg",
  })
  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement)
  return (
    <ScrollAreaBase.Viewport
      {...rest}
      ref={ref}
      className={cn("block size-full", maskClassName, className)}
    />
  )
})
Viewport.displayName = "ScrollArea.Viewport"

export const Root = React.forwardRef<
  React.ElementRef<typeof ScrollAreaBase.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Root>
>(({ className, children, ...rest }, forwardedRef) => (
  <ScrollAreaBase.Root
    {...rest}
    ref={forwardedRef}
    className={cn("overflow-hidden", className)}
  >
    {children}
    <Corner />
  </ScrollAreaBase.Root>
))

Root.displayName = "ScrollArea.Root"
export const ScrollArea: React.FC<
  React.PropsWithChildren & {
    rootClassName?: string
    viewportClassName?: string
    scrollbarClassName?: string
  }
> = ({ children, rootClassName, viewportClassName, scrollbarClassName }) => (
  <Root className={rootClassName}>
    <Viewport onWheel={stopPropagation} className={viewportClassName}>
      {children}
    </Viewport>
    <Scrollbar
      className={scrollbarClassName}
    />
  </Root>
)
