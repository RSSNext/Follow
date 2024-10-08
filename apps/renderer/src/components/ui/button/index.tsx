import type { VariantProps } from "class-variance-authority"
import type { HTMLMotionProps } from "framer-motion"
import { m } from "framer-motion"
import * as React from "react"
import { useHotkeys } from "react-hotkeys-hook"
import type { OptionsOrDependencyArray } from "react-hotkeys-hook/dist/types"

import { stopPropagation } from "~/lib/dom"
import { cn } from "~/lib/utils"

import { KbdCombined } from "../kbd/Kbd"
import { LoadingCircle } from "../loading"
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "../tooltip"
import { styledButtonVariant } from "./variants"

export interface BaseButtonProps {
  isLoading?: boolean
}

// BIZ buttons

interface ActionButtonProps {
  icon?: React.ReactNode | React.FC<ComponentType>
  tooltip?: React.ReactNode
  tooltipSide?: "top" | "bottom"
  active?: boolean
  disabled?: boolean
  shortcut?: string
  disableTriggerShortcut?: boolean
}

export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  ComponentType<ActionButtonProps> & React.HTMLAttributes<HTMLButtonElement>
>(
  (
    {
      icon,

      tooltip,
      className,
      tooltipSide,
      children,
      active,
      shortcut,
      disabled,
      disableTriggerShortcut,
      ...rest
    },
    ref,
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    React.useImperativeHandle(ref, () => buttonRef.current!)

    const Trigger = (
      <button
        ref={buttonRef}
        // @see https://github.com/radix-ui/primitives/issues/2248#issuecomment-2147056904
        onFocusCapture={stopPropagation}
        className={cn(
          "no-drag-region inline-flex size-8 items-center justify-center text-xl",
          active && "bg-zinc-500/15 hover:bg-zinc-500/20",
          //"focus-visible:bg-zinc-500/30 focus-visible:!outline-none",
          "rounded-md duration-200 hover:bg-theme-button-hover data-[state=open]:bg-theme-button-hover",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        type="button"
        disabled={disabled}
        {...rest}
      >
        {typeof icon === "function"
          ? React.createElement(icon, {
              className: "size-4 grayscale text-current",
            })
          : icon}

        {children}
      </button>
    )
    return (
      <>
        {shortcut && !disableTriggerShortcut && (
          <HotKeyTrigger shortcut={shortcut} fn={() => buttonRef.current?.click()} />
        )}
        {tooltip ? (
          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>{Trigger}</TooltipTrigger>
            <TooltipPortal>
              <TooltipContent className="flex items-center gap-1" side={tooltipSide ?? "bottom"}>
                {tooltip}
                {!!shortcut && (
                  <div className="ml-1">
                    <KbdCombined className="text-foreground/80">{shortcut}</KbdCombined>
                  </div>
                )}
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        ) : (
          Trigger
        )}
      </>
    )
  },
)

const HotKeyTrigger = ({
  shortcut,
  fn,
  options,
}: {
  shortcut: string
  fn: () => void
  options?: OptionsOrDependencyArray
}) => {
  useHotkeys(shortcut, fn, {
    preventDefault: true,
    ...options,
  })
  return null
}
export const MotionButtonBase = React.forwardRef<HTMLButtonElement, HTMLMotionProps<"button">>(
  ({ children, ...rest }, ref) => (
    <m.button
      layout="size"
      initial
      whileFocus={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      {...rest}
      ref={ref}
    >
      {children}
    </m.button>
  ),
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
>(({ className, buttonClassName, isLoading, variant, status, ...props }, ref) => {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = React.useCallback(
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
      className={cn(
        styledButtonVariant({
          variant,
          status: isLoading || props.disabled ? "disabled" : undefined,
        }),
        className,
        buttonClassName,
      )}
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
