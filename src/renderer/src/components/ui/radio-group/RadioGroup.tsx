import { useId, useMemo, useRef, useState } from "react"

import { RadioGroupContextProvider, RadioGroupValueProvider } from "./context"

export const RadioGroup: Component<{
  value?: string
  onValueChange?: (value: string) => void
}> = (props) => {
  const id = useId()
  const { onValueChange, value } = props

  const stableOnValueChange = useRef(onValueChange).current

  const [currentValue, setCurrentValue] = useState(value)
  return (
    <RadioGroupContextProvider
      value={useMemo(
        () => ({
          groupId: id,
          onChange(value) {
            setCurrentValue(value)
            stableOnValueChange?.(value)
          },
        }),
        [id, stableOnValueChange],
      )}
    >
      <RadioGroupValueProvider value={currentValue}>
        {props.children}
      </RadioGroupValueProvider>
    </RadioGroupContextProvider>
  )
}
