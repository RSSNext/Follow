import type { CompositionEventHandler } from "react"
import { useCallback, useRef } from "react"

type InputElementAttributes = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>
type TextareaElementAttributes = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>
export const useInputComposition = <E = HTMLInputElement>(
  props: Pick<
    E extends HTMLInputElement
      ? InputElementAttributes
      : E extends HTMLTextAreaElement
        ? TextareaElementAttributes
        : never,
    "onKeyDown" | "onCompositionEnd" | "onCompositionStart"
  >,
) => {
  const { onKeyDown, onCompositionStart, onCompositionEnd } = props

  const isCompositionRef = useRef(false)

  const handleCompositionStart: CompositionEventHandler<E> = useCallback(
    (e) => {
      isCompositionRef.current = true
      onCompositionStart?.(e as any)
    },
    [onCompositionStart],
  )

  const handleCompositionEnd: CompositionEventHandler<E> = useCallback(
    (e) => {
      isCompositionRef.current = false
      onCompositionEnd?.(e as any)
    },
    [onCompositionEnd],
  )

  const handleKeyDown: React.KeyboardEventHandler<E> = useCallback(
    (e: any) => {
      // The keydown event stop emit when the composition is being entered
      if (isCompositionRef.current) {
        e.stopPropagation()
        return
      }
      onKeyDown?.(e)

      if (e.key === "Escape") {
        e.currentTarget.blur()
        e.preventDefault()
        e.stopPropagation()
      }
    },
    [onKeyDown],
  )

  const ret = {
    onCompositionEnd: handleCompositionEnd,
    onCompositionStart: handleCompositionStart,
    onKeyDown: handleKeyDown,
  }
  Object.defineProperty(ret, "isCompositionRef", {
    value: isCompositionRef,
    enumerable: false,
  })
  return ret as typeof ret & {
    isCompositionRef: typeof isCompositionRef
  }
}
