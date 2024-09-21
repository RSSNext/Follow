import type { FC, ReactNode } from "react"
import { useId } from "react"
import { useEventCallback } from "usehooks-ts"

import { cn } from "~/lib/utils"

import { useRadioContext, useRadioGroupValue } from "./context"

export const Radio: FC<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    label: ReactNode
    wrapperClassName?: string
  }
> = (props) => {
  const { id, label, className, wrapperClassName, value, onChange, ...rest } = props
  const { onChange: ctxOnChange } = useRadioContext() || {}
  const fallbackId = useId()

  const ctxValue = useRadioGroupValue()

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useEventCallback((e) => {
    ctxOnChange?.(e.target.value)
    onChange?.(e)
  })
  return (
    <div className={cn("flex items-center", wrapperClassName)}>
      <input
        {...rest}
        type="radio"
        id={id ?? fallbackId}
        className={cn(
          "radio radio-accent radio-sm accent-accent disabled:radio-current disabled:cursor-not-allowed disabled:text-theme-disabled",
          className,
        )}
        value={value}
        checked={ctxValue === value}
        onChange={handleChange}
      />

      <label
        className={cn(rest.disabled ? "text-theme-disabled" : "", "pl-2")}
        htmlFor={id ?? fallbackId}
      >
        {label}
      </label>
    </div>
  )
}
