import { useMobile } from "@follow/components/hooks/useMobile.js"
import { LoadingCircle } from "@follow/components/ui/loading/index.jsx"
import { cn } from "@follow/utils/utils"
import type { VariantProps } from "class-variance-authority"
import type { HTMLMotionProps } from "framer-motion"
import { m } from "framer-motion"
import * as React from "react"

import { styledButtonVariant } from "./variants"

export interface BaseButtonProps {
  isLoading?: boolean
}

// BIZ buttons

const motionBaseMap = {
  pc: {
    whileFocus: { scale: 1.02 },
    whileTap: { scale: 0.95 },
  },
  mobile: {
    whileFocus: { opacity: 0.8 },
    whileTap: { opacity: 0.2 },
  },
} as const
export const MotionButtonBase = React.forwardRef<HTMLButtonElement, HTMLMotionProps<"button">>(
  ({ children, ...rest }, ref) => {
    const isMobile = useMobile()
    return (
      <m.button
        layout="size"
        initial
        {...motionBaseMap[isMobile ? "mobile" : "pc"]}
        {...rest}
        ref={ref}
      >
        {children}
      </m.button>
    )
  },
)

MotionButtonBase.displayName = "MotionButtonBase"

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<
    Omit<HTMLMotionProps<"button">, "children"> &
      BaseButtonProps &
      VariantProps<typeof styledButtonVariant> & {
        buttonClassName?: string
      }
  >
>(({ className, buttonClassName, disabled, isLoading, variant, status, ...props }, ref) => {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = React.useCallback(
    (e) => {
      if (isLoading || disabled) {
        e.preventDefault()
        return
      }

      props.onClick?.(e)
    },
    [disabled, isLoading, props],
  )
  return (
    <MotionButtonBase
      ref={ref}
      className={cn(
        styledButtonVariant({
          variant,
          status: isLoading || disabled ? "disabled" : undefined,
        }),
        className,
        buttonClassName,
      )}
      disabled={isLoading || disabled}
      {...props}
      onClick={handleClick}
    >
      <span className="contents">
        {typeof isLoading === "boolean" && (
          <m.span
            className="center"
            animate={{
              width: isLoading ? "auto" : "0px",
            }}
          >
            {isLoading && <LoadingCircle size="small" className="center mr-2" />}
          </m.span>
        )}
        <span className={cn("center", className)}>{props.children}</span>
      </span>
    </MotionButtonBase>
  )
})

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> &
    React.PropsWithChildren<{
      icon: React.JSX.Element
    }>
>((props, ref) => {
  const { icon, ...rest } = props
  return (
    <button
      ref={ref}
      type="button"
      {...rest}
      className={cn(
        styledButtonVariant({
          variant: "ghost",
        }),
        "group relative gap-2 bg-accent/10 px-4 hover:bg-accent dark:bg-accent/20 dark:hover:bg-accent/60",
        rest.className,
      )}
    >
      <span className="center">
        {React.cloneElement(icon, {
          className: cn("invisible", icon.props.className),
        })}

        {React.cloneElement(icon, {
          className: cn(
            "group-hover:text-white dark:group-hover:text-inherit",
            "absolute left-4 top-1/2 -translate-y-1/2 duration-200 group-hover:left-1/2 group-hover:-translate-x-1/2",
            icon.props.className,
          ),
        })}
      </span>
      <span className="duration-200 group-hover:opacity-0">{props.children}</span>
    </button>
  )
})

export { ActionButton, type ActionButtonProps } from "./action-button"
