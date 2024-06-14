import { useLayoutEffect, useRef } from "react"

export const useRefValue = <S>(
  value: S,
): Readonly<{
  current: Readonly<S>
}> => {
  const ref = useRef<S>(value)

  useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}
