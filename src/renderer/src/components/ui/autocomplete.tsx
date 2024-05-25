import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@renderer/components/ui/command"
import { useState, useCallback } from "react"

import { cn } from "@renderer/lib/utils"
import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  options: string[]
  emptyMessage: string
  value?: string
}

export const AutoComplete = React.forwardRef<HTMLInputElement, InputProps>(
  ({ options, emptyMessage, className, value, ...props }, ref) => {
    const [open, setOpen] = useState(false)

    const onValueChange = useCallback(
      (value: string) => {
        props.onChange?.({
          target: {
            value,
          },
        } as React.ChangeEvent<HTMLInputElement>)
      },
      [props.onChange],
    )

    const handleSelectOption = useCallback(
      (option: string) => {
        setOpen(false)
        onValueChange(option)
      },
      [props.onChange],
    )

    return (
      <Command className="relative overflow-visible rounded-lg border [&_.lucide-search]:hidden [&_[cmdk-input-wrapper]]:border-0">
        <CommandInput
          {...props}
          onBlur={(e) => {
            setOpen(false)
            props.onBlur?.(e)
          }}
          onFocus={(e) => {
            setOpen(true)
            props.onFocus?.(e)
          }}
          value={value}
          onValueChange={(value) => {
            setOpen(true)
            onValueChange(value)
          }}
          ref={ref}
        />
        <CommandList>
          <CommandGroup
            className={cn(
              "absolute top-full z-10 mt-1 hidden w-full rounded-lg border bg-white [&[hidden]]:!hidden",
              open && "block",
            )}
          >
            {options.map((option) => (
              <CommandItem
                key={option}
                value={option}
                onSelect={() => handleSelectOption(option)}
                className="text-zinc-800"
                onMouseDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
              >
                {option}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )
  },
)
AutoComplete.displayName = "AutoComplete"
