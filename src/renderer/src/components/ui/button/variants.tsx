import { cn } from "@renderer/lib/utils"
import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-4",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10",
        icon: "size-10",
      },
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-theme-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-theme-button-hover px-1.5",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)
export const styledButtonVariant = cva(
  cn(
    "inline-flex cursor-default select-none items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm outline-offset-2 transition active:transition-none disabled:cursor-not-allowed",
    "ring-theme-accent/20 duration-200 focus:border-theme-accent/80 focus:outline-none focus:ring-2 disabled:ring-0",
  ),
  {
    compoundVariants: [
      {
        variant: "primary",
        status: "disabled",
        className: "text-zinc-50 bg-theme-disabled",
      },
      {
        variant: "outline",
        status: "disabled",
        className:
          "text-theme-disabled border-theme-inactive dark:border-zinc-800 hover:!bg-theme-background",
      },
      {
        variant: "text",
        status: "disabled",
        className: "opacity-60",
      },
    ],
    variants: {
      status: {
        disabled: "cursor-not-allowed",
      },
      variant: {
        primary: cn(
          "bg-theme-accent",
          "hover:contrast-[1.10] active:contrast-125",
          "font-semibold",
          "disabled:bg-theme-disabled disabled:dark:text-zinc-50",
          "text-zinc-100 dark:text-zinc-200/90",
        ),

        outline: cn(
          "bg-theme-background font-semibold transition-colors duration-200",
          "border border-border hover:bg-zinc-50/20 dark:bg-neutral-900/30",
        ),
        text: cn(
          "font-semibold text-theme-accent",
          "hover:contrast-[1.10] active:contrast-125",
        ),
      },
    },

    defaultVariants: {
      variant: "primary",
    },
  },
)
