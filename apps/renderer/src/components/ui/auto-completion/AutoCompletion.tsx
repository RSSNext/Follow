import clsx from "clsx"
import { AnimatePresence } from "framer-motion"
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

import { useRefValue } from "~/hooks/common"
import { nextFrame, stopPropagation } from "~/lib/dom"
import { cn } from "~/lib/utils"

import { Input } from "../input"
import { RootPortal } from "../portal"

export type Suggestion = {
  name: string
  value: string
}
export interface AutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
    const [filterableSuggestions, setFilterableSuggestions] = useState(suggestions)
    const [inputValue, setInputValue] = useState(inputProps.value || inputProps.defaultValue || "")

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

    useEffect(() => {
      const $input = inputRef.current
      if (!$input) return
      if (document.activeElement !== $input) {
        return
      }

      setIsOpen(filterableSuggestions.length > 0)
    }, [filterableSuggestions])

    const [isOpen, setIsOpen] = useState(false)

    const [listRef, setListRef] = useState<HTMLElement | null>(null)
    const onBlur = useEventCallback((e: any) => {
      inputProps.onBlur?.(e)
      if (listRef?.contains(e.relatedTarget)) {
        return
      }
      setIsOpen(false)
    })

    const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useEventCallback(
      (e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          onConfirm?.((e.target as HTMLInputElement).value)
          setIsOpen(false)
        }
        inputProps.onKeyDown?.(e)
      },
    )
    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(forwardedRef, () => inputRef.current!)

    const [currentActiveIndex, setCurrentActiveIndex] = useState(0)
    const currentActiveIndexRef = useRefValue(currentActiveIndex)
    const filterableSuggestionsRef = useRefValue(filterableSuggestions)
    // Bind hotkey
    useEffect(() => {
      const $input = inputRef.current
      if (!$input) return
      const handleKeyDown = (e: KeyboardEvent) => {
        const currentActiveIndex = currentActiveIndexRef.current
        const filterableSuggestionsLength = filterableSuggestionsRef.current.length
        const filterableSuggestions = filterableSuggestionsRef.current

        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault()
          const nextIndex =
            currentActiveIndex + (e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0)
          setCurrentActiveIndex(Math.max(0, Math.min(nextIndex, filterableSuggestionsLength - 1)))
        } else if (
          (e.key === "Enter" || e.key === "Tab") &&
          currentActiveIndex >= 0 &&
          currentActiveIndex < filterableSuggestionsLength
        ) {
          e.stopPropagation()
          e.preventDefault()

          onSuggestionSelected(filterableSuggestions[currentActiveIndex])
          setInputValue(filterableSuggestions[currentActiveIndex].name)

          nextFrame(() => {
            setIsOpen(false)
          })
        }
      }

      $input.addEventListener("keydown", handleKeyDown)
      return () => {
        $input.removeEventListener("keydown", handleKeyDown)
      }
    }, [currentActiveIndexRef, filterableSuggestionsRef, onSuggestionSelected])

    const [inputRect, setInputRect] = useState<DOMRect | null>(null)
    const [dropdownPos, setDropdownPos] = useState("down")
    const [dropdownHeight, setDropdownHeight] = useState(maxHeight || 200)

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
          "pointer-events-auto z-[999] mt-1 overflow-hidden",
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
          portal && inputRect
            ? {
                width: `${inputRect.width}px`,
                left: `${inputRect.x}px`,
                top: `${inputRect.y + inputRect.height}px`,
                bottom: dropdownPos === "up" ? 0 : undefined,
                transform: dropdownPos === "up" ? `translateY(-${dropdownHeight}px)` : undefined,
                maxHeight,
              }
            : {},
        )}
      >
        <ul
          data-state={isOpen ? "open" : "closed"}
          className={clsx(
            "pointer-events-auto max-h-48 grow",
            "overflow-auto rounded-md border border-border bg-popover text-popover-foreground",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
          //  FIXME: https://github.com/radix-ui/primitives/issues/2125
          onWheel={stopPropagation}
          onScroll={handleScroll}
        >
          {filterableSuggestions.map((suggestion, index) => {
            const handleClick = () => {
              onSuggestionSelected(suggestion)
              setIsOpen(false)

              setInputValue(suggestion.name)
            }
            return (
              <li
                className={cn(
                  "cursor-default px-4 py-1.5 text-sm",

                  currentActiveIndex === index && "bg-theme-item-hover dark:bg-neutral-800",
                )}
                key={suggestion.value}
                onMouseDown={handleClick}
                onMouseEnter={() => setCurrentActiveIndex(index)}
              >
                {renderSuggestion(suggestion)}
              </li>
            )
          })}
        </ul>
      </div>
    )
    const handleFocus: React.FocusEventHandler<HTMLInputElement> = useEventCallback((e) => {
      setIsOpen(true)
      inputProps.onFocus?.(e)
    })

    return (
      <div className={cn("pointer-events-auto relative", wrapperClassName)}>
        <div className="relative">
          <Input
            value={inputValue}
            ref={inputRef}
            className="pr-8"
            {...inputProps}
            onBlur={onBlur}
            onKeyDown={handleInputKeyDown}
            onChange={handleChange}
            onFocus={handleFocus}
          />
          {!!inputValue && (
            <button
              onClick={() => {
                setInputValue("")
                onChange?.({ target: { value: "" } } as any)
              }}
              type="button"
              className="center absolute inset-y-0 right-0 flex px-2 opacity-80 duration-200 hover:opacity-100"
            >
              <i className="i-mingcute-close-circle-fill" />
            </button>
          )}
        </div>
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
