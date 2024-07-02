import { cn } from "@renderer/lib/utils"
import type { FC, ReactNode } from "react"
import { useEventCallback } from "usehooks-ts"

import { useRadioContext, useRadioGroupValue } from "./context"

export const RadioCard: FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & {
    label: ReactNode
    wrapperClassName?: string
  }
> = (props) => {
  const { id, label, className, wrapperClassName, value, onChange, ...rest } =
    props
  const { groupId, onChange: ctxOnChange } = useRadioContext() || {}

  const ctxValue = useRadioGroupValue()

  const handleChange: React.ChangeEventHandler<HTMLInputElement> =
    useEventCallback((e) => {
      ctxOnChange?.(e.target.value)
      onChange?.(e)
    })

  const selected = value === ctxValue

  return (
    <label
      id={groupId || id}
      className={cn(
        "flex cursor-pointer items-center rounded-md p-2",
        "border bg-background hover:border-theme-accent-400",

        "ring-0 ring-theme-accent/20 duration-200",

        selected && "border-theme-accent-500 border-theme-accent/80 outline-none ring-2",
        wrapperClassName,
      )}
    >
      <input
        id={id}
        type="radio"
        className={cn("hidden size-0", className)}
        value={value}
        checked={ctxValue === value}
        onChange={handleChange}
        {...rest}
      />
      <span>{label}</span>
    </label>
  )
}
