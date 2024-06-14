import { Slot } from "@radix-ui/react-slot"
import { stopPropagation } from "@renderer/lib/dom"
import { cn } from "@renderer/lib/utils"
import type { VariantProps } from "class-variance-authority"
import type { HTMLMotionProps } from "framer-motion"
import { m } from "framer-motion"
import * as React from "react"

import { LoadingCircle } from "../loading"
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip"
import { buttonVariants, styledButtonVariant } from "./variants"

export interface BaseButtonProps {
  isLoading?: boolean
}
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants>,
  BaseButtonProps {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, isLoading = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled={props.disabled || isLoading}
      >
        {isLoading && (
          <i className="i-mingcute-loading-3-line mr-2 animate-spin" />
        )}
        {props.children}
      </Comp>
    )
  },
)
Button.displayName = "Button"

// BIZ buttons

interface ActionButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  icon?: React.ReactNode | React.FC<ComponentType>
  tooltip: string
  tooltipSide?: "top" | "bottom"
  active?: boolean
}
export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  ComponentType<ActionButtonProps>
>(
  (
    { icon, onClick, tooltip, className, tooltipSide, children, active },
    ref,
  ) => (
    <Tooltip key={tooltip} disableHoverableContent>
      <TooltipTrigger asChild ref={ref}>
        <Button
          // @see https://github.com/radix-ui/primitives/issues/2248#issuecomment-2147056904
          onFocusCapture={stopPropagation}
          className={cn(
            "no-drag-region flex size-8 items-center text-xl",
            active && "bg-zinc-500/15 hover:bg-zinc-500/20",
            className,
          )}
          variant="ghost"
          size="sm"
          onClick={onClick}
        >
          {typeof icon === "function" ?
            React.createElement(icon, {
              className: "size-4 grayscale text-current",
            }) :
            icon}

          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide ?? "bottom"}>{tooltip}</TooltipContent>
    </Tooltip>
  ),
)

export const MotionButtonBase = React.forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<"button">
>(({ children, ...rest }, ref) => (
  <m.button
    initial
    whileFocus={{ scale: 1.02 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.95 }}
    {...rest}
    ref={ref}
  >
    {children}
  </m.button>
))

MotionButtonBase.displayName = "MotionButtonBase"

export const StyledButton = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<
    Omit<HTMLMotionProps<"button">, "children"> &
    BaseButtonProps &
    VariantProps<typeof styledButtonVariant>
  >
>(({ className, isLoading, variant, status, ...props }, ref) => {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> =
    React.useCallback(
      (e) => {
        if (isLoading || props.disabled) {
          e.preventDefault()
          return
        }

        props.onClick?.(e)
      },
      [isLoading, props],
    )
  return (
    <MotionButtonBase
      ref={ref}
      className={styledButtonVariant({
        variant,
        className,
        status: isLoading || props.disabled ? "disabled" : undefined,
      })}
      {...props}
      onClick={handleClick}
    >
      <m.span layout="size" className="center">
        {isLoading && (
          <m.span>
            <LoadingCircle size="small" className="mr-2" />
          </m.span>
        )}
        <m.span>{props.children}</m.span>
      </m.span>
    </MotionButtonBase>
  )
})
