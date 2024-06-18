import * as Popover from "@radix-ui/react-popover"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@renderer/components/ui/command"
import { cn } from "@renderer/lib/utils"
import { useCallback, useState } from "react"
import * as React from "react"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> {
  // TODO isLoading
  options: string[]
  emptyMessage: string
  value?: string | null
  maxHeight?: number
}
/**
 * @deprecated please use `ui/auto-completion` instead
 */
export const AutoComplete = React.forwardRef<HTMLInputElement, InputProps>(
  ({ options, emptyMessage, className, value, maxHeight, ...props }, ref) => {
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

    const inputRef = React.useRef<HTMLInputElement>(null)
    const [dropdownHeight, setDropdownHeight] = React.useState(
      maxHeight || 200,
    )
    const [inputRect, setInputRect] = React.useState<DOMRect | null>(null)
    const [dropdownPos, setDropdownPos] = React.useState("down")
    React.useLayoutEffect(() => {
      if (!inputRef.current) {
        return
      }
      const rect = inputRef.current.getBoundingClientRect()
      const { top, height } = rect

      if (top + height + dropdownHeight > window.innerHeight) {
        setDropdownPos("up")
      } else {
        setDropdownPos("down")
      }
      setInputRect(rect)
    }, [inputRect?.height, dropdownHeight])

    React.useImperativeHandle(ref, () => inputRef.current!)

    return (
      <Command className="relative overflow-visible rounded-lg border bg-theme-background [&_.lucide-search]:hidden [&_[cmdk-input-wrapper]]:border-0">
        <Popover.Root open={open && options.length > 0}>
          <Popover.Trigger>
            <CommandInput
              {...props}
              className="h-10"
              onBlur={(e) => {
                setOpen(false)
                props.onBlur?.(e)
              }}
              onFocus={(e) => {
                setOpen(true)
                props.onFocus?.(e)
              }}
              value={value || void 0}
              onValueChange={(value) => {
                setOpen(true)
                onValueChange(value)
              }}
              ref={inputRef}
            />
          </Popover.Trigger>

          <CommandList>
            <Popover.Portal>
              <Popover.Content>
                <div
                  style={{
                    width: inputRect?.width,
                    bottom: dropdownPos === "up" ? 0 : undefined,
                    transform:
                      dropdownPos === "up" ?
                        `translateY(-${
                            dropdownHeight + (inputRect?.height || 0)
                          }px)` :
                        undefined,
                  }}
                >
                  <CommandGroup
                    className={cn(
                      "absolute top-full z-10 mt-1 hidden w-full rounded-lg border bg-theme-background [&[hidden]]:!hidden",

                      open && "block",
                    )}
                    ref={(el: HTMLDivElement) => {
                      if (el) {
                        setDropdownHeight(el.clientHeight)
                      }
                    }}
                    style={{
                      maxHeight,
                    }}
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
                </div>
              </Popover.Content>
            </Popover.Portal>
          </CommandList>
        </Popover.Root>
      </Command>
    )
  },
)
AutoComplete.displayName = "AutoComplete"
