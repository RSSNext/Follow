import type { CompositionEventHandler } from "react"
import { useCallback, useRef } from "react"

export const useInputComposition = (
  props: Pick<
    | React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >
      | React.DetailedHTMLProps<
        React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
      >,
    "onKeyDown" | "onCompositionEnd" | "onCompositionStart"
  >,
) => {
  const { onKeyDown, onCompositionStart, onCompositionEnd } = props

  const isCompositionRef = useRef(false)

  const handleCompositionStart: CompositionEventHandler<any> = useCallback(
    (e) => {
      isCompositionRef.current = true
      onCompositionStart?.(e)
    },
    [onCompositionStart],
  )

  const handleCompositionEnd: CompositionEventHandler<any> = useCallback(
    (e) => {
      isCompositionRef.current = false
      onCompositionEnd?.(e)
    },
    [onCompositionEnd],
  )

  const handleKeyDown: React.KeyboardEventHandler<any> = useCallback(
    (e) => {
      onKeyDown?.(e)

      if (isCompositionRef.current) {
        e.stopPropagation()
        return
      }
    },
    [onKeyDown],
  )

  return {
    onCompositionEnd: handleCompositionEnd,
    onCompositionStart: handleCompositionStart,
    onKeyDown: handleKeyDown,
  }
}
