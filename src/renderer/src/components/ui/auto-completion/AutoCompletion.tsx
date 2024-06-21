import { stopPropagation } from "@renderer/lib/dom"
import { cn } from "@renderer/lib/utils"
import clsx from "clsx"
import { AnimatePresence, m } from "framer-motion"
import Fuse from "fuse.js"
import { merge, throttle } from "lodash-es"
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"

import { Input } from "../input"
import { RootPortal } from "../portal"

export type Suggestion = {
  name: string
  value: string
}
export interface AutocompleteProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestions: Suggestion[]
  renderSuggestion?: (suggestion: Suggestion) => any

  onSuggestionSelected: (suggestion: Suggestion) => void
  onConfirm?: (value: string) => void
  onEndReached?: () => void

  portal?: boolean

  // classnames

  wrapperClassName?: string

  maxHeight?: number
}

const defaultRenderSuggestion = (suggestion: any) => suggestion.name
export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      suggestions,
      renderSuggestion = defaultRenderSuggestion,
      onSuggestionSelected,
      onConfirm,
      onEndReached,
      onChange,
      portal,
      wrapperClassName,
      maxHeight,

      ...inputProps
    },
    forwardedRef,
  ) => {
    const [filterableSuggestions, setFilterableSuggestions] =
      useState(suggestions)
    const [inputValue, setInputValue] = useState(
      inputProps.value || inputProps.defaultValue || "",
    )

    const doFilter = useEventCallback(() => {
      const fuse = new Fuse(suggestions, {
        keys: ["name", "value"],
      })
      const trimInputValue = (inputValue as string).trim()

      if (!trimInputValue) return setFilterableSuggestions(suggestions)

      const results = fuse.search(trimInputValue)
      setFilterableSuggestions(results.map((result) => result.item))
    })
    useEffect(() => {
      doFilter()
    }, [inputValue, suggestions])

    const [isOpen, setIsOpen] = useState(false)

    const [listRef, setListRef] = useState<HTMLElement | null>(null)
    const onBlur = useEventCallback((e: any) => {
      inputProps.onBlur?.(e)
      if (listRef?.contains(e.relatedTarget)) {
        return
      }
      setIsOpen(false)
    })

    const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> =
      useEventCallback((e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          onConfirm?.((e.target as HTMLInputElement).value)
          setIsOpen(false)
        }
        inputProps.onKeyDown?.(e)
      })
    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(forwardedRef, () => inputRef.current!)

    const [inputRect, setInputRect] = useState<DOMRect | null>(null)

    const [dropdownHeight, setDropdownHeight] = useState(maxHeight || 200)

    const [dropdownPos, setDropdownPos] = useState("down")

    // useLayoutEffect(() => {
    //   const $list = listRef
    //   if (!$list) return
    //   const handler = () => {
    //     const rect = $list.getBoundingClientRect()

    //     setDropdownHeight(rect.height)
    //   }
    //   const ob = new ResizeObserver(handler)
    //   handler()

    //   // setInterval(handler, 1000)
    //   ob.observe($list)
    //   return () => {
    //     ob.disconnect()
    //   }
    // }, [listRef])
    useLayoutEffect(() => {
      const $input = inputRef.current
      if (!$input) return

      const handler = () => {
        const rect = $input.getBoundingClientRect()

        setInputRect(rect)

        const { top, height } = rect

        if (top + height + dropdownHeight > window.innerHeight) {
          setDropdownPos("up")
        } else {
          setDropdownPos("down")
        }
      }
      handler()

      const resizeObserver = new ResizeObserver(handler)
      resizeObserver.observe($input)

      return () => {
        resizeObserver.disconnect()
      }
    }, [dropdownHeight])

    const handleScroll = useEventCallback(
      throttle(() => {
        if (!listRef) return
        const { scrollHeight, scrollTop, clientHeight } = listRef!
        // gap 50px
        if (scrollHeight - scrollTop - clientHeight < 50) {
          onEndReached?.()
        }
      }, 30),
    )

    const handleChange = useEventCallback((e: any) => {
      setInputValue(e.target.value)
      onChange?.(e)
    })

    const ListElement = (
      <div
        className={clsx(
          "pointer-events-auto z-[101] mt-1 overflow-hidden",
          portal ? "absolute flex flex-col" : "absolute w-full",
        )}
        ref={useCallback((el) => {
          setListRef(el)

          const height = el?.getBoundingClientRect().height
          if (height) {
            setDropdownHeight(height)
          }
        }, [])}
        style={merge(
          {},
          portal && inputRect ?
              {
                width: `${inputRect.width}px`,
                left: `${inputRect.x}px`,
                top: `${inputRect.y + inputRect.height}px`,
                bottom: dropdownPos === "up" ? 0 : undefined,
                transform:
                  dropdownPos === "up" ?
                    `translateY(-${dropdownHeight}px)` :
                    undefined,
                maxHeight,
              } :
              {},
        )}
      >
        <m.ul
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={clsx(
            "pointer-events-auto max-h-48 grow",
            "overflow-auto rounded-md border border-zinc-200 bg-popover text-popover-foreground",
          )}
          //  FIXME: https://github.com/radix-ui/primitives/issues/2125
          onWheel={stopPropagation}
          onScroll={handleScroll}
        >
          {filterableSuggestions.map((suggestion) => {
            const handleClick = () => {
              onSuggestionSelected(suggestion)
              setIsOpen(false)

              setInputValue(suggestion.name)
            }
            return (
              <li
                className="cursor-default px-4 py-1.5 text-sm hover:bg-theme-item-hover dark:hover:bg-neutral-800"
                key={suggestion.value}
                onMouseDown={handleClick}
                onClick={handleClick}
              >
                {renderSuggestion(suggestion)}
              </li>
            )
          })}
        </m.ul>
      </div>
    )
    const handleFocus: React.FocusEventHandler<HTMLInputElement> =
      useEventCallback((e) => {
        setIsOpen(true)
        inputProps.onFocus?.(e)
      })

    return (
      <div className={cn("pointer-events-auto relative", wrapperClassName)}>
        <Input
          value={inputValue}
          ref={inputRef}
          {...inputProps}
          onBlur={onBlur}
          onKeyDown={handleInputKeyDown}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <AnimatePresence>
          {isOpen &&
            filterableSuggestions.length > 0 &&
            (portal ? <RootPortal>{ListElement}</RootPortal> : ListElement)}
        </AnimatePresence>
      </div>
    )
  },
)

Autocomplete.displayName = "Autocomplete"
