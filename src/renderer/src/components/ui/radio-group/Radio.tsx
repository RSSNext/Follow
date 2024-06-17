import { cn } from "@renderer/lib/utils"
import type { FC, ReactNode } from "react"
import { useEventCallback } from "usehooks-ts"

import { useRadioContext, useRadioGroupValue } from "./context"

export const Radio: FC<
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
  return (
    <div className={cn("flex items-center gap-2", wrapperClassName)}>
      <input
        {...rest}
        type="radio"
        id={groupId || id}
        className={cn(
          "radio radio-primary radio-sm disabled:radio-current disabled:cursor-not-allowed disabled:text-theme-disabled",
          className,
        )}
        value={value}
        checked={ctxValue === value}
        onChange={handleChange}
      />

      <label
        className={cn(
          rest.disabled ? "text-theme-disabled" : "",
        )}
        htmlFor={groupId || id}
      >
        {label}
      </label>
    </div>
  )
}
