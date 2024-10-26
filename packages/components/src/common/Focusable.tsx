import type { FocusEvent, Ref } from "react"
import { createContext, forwardRef, useCallback, useContext, useState } from "react"

// const
const FocusableContext = createContext(false)
export const Focusable = forwardRef(function Focusable(
  props: React.ComponentPropsWithoutRef<"div">,
  ref: Ref<HTMLDivElement>,
) {
  const { onBlur, onFocus, ...rest } = props
  const [isFocusWithIn, setIsFocusWithIn] = useState(false)
  const handleFocus = useCallback(
    (e: FocusEvent<HTMLDivElement>) => {
      onFocus?.(e)
      setIsFocusWithIn(true)
    },
    [onFocus],
  )
  const handleBlur = useCallback(
    (e: FocusEvent<HTMLDivElement>) => {
      onBlur?.(e)
      setIsFocusWithIn(false)
    },
    [onBlur],
  )

  return (
    <FocusableContext.Provider value={isFocusWithIn}>
      <div
        tabIndex={-1}
        role="region"
        ref={ref}
        {...rest}
        onBlur={handleBlur}
        onFocusCapture={handleFocus}
        onBlurCapture={handleBlur}
        onFocus={handleFocus}
      />
    </FocusableContext.Provider>
  )
})

export const useFocusable = () => {
  return useContext(FocusableContext)
}
