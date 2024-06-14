import { cn } from "@renderer/lib/utils"
import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-zinc-500/10 px-1.5",
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
  "inline-flex select-none disabled:cursor-not-allowed cursor-default items-center gap-2 justify-center rounded-lg py-2 px-3 text-sm outline-offset-2 transition active:transition-none",
  {
    compoundVariants: [
      {
        variant: "primary",
        status: "disabled",
        className: "text-zinc-50 bg-theme-accent/30",
      },
      {
        variant: "plain",
        status: "disabled",
        className: "text-primary-foreground/50",
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
          "disabled:bg-theme-accent/40 disabled:opacity-80 disabled:dark:text-zinc-50",
          "text-zinc-100 dark:text-zinc-200/90",
        ),

        plain: cn(
          "bg-background font-semibold transition-colors duration-200",
          "border border-border hover:bg-zinc-50/20 dark:bg-neutral-900/30",
        ),
      },
    },

    defaultVariants: {
      variant: "primary",
    },
  },
)
