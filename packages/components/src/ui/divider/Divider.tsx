import { cn } from "@follow/utils/utils"
import type { DetailedHTMLProps, FC, HTMLAttributes } from "react"

export const Divider: FC<DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>> = (
  props,
) => {
  const { className, ...rest } = props
  return (
    <hr
      className={cn("my-4 h-[0.5px] border-0 bg-black !bg-opacity-30 dark:bg-white", className)}
      {...rest}
    />
  )
}

export const DividerVertical: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
> = (props) => {
  const { className, ...rest } = props
  return (
    <span
      className={cn(
        "mx-4 inline-block h-full w-[0.5px] select-none bg-black text-transparent !opacity-20 dark:bg-white",
        className,
      )}
      {...rest}
    >
      w
    </span>
  )
}
