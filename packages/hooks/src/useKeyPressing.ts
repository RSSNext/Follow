import { useEffect, useMemo, useState } from "react"

export function useKeyPressing(key: string) {
  const [keysPressed, setKeysPressed] = useState<string[]>([])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeysPressed((prev) => {
        if (!prev.includes(event.key)) {
          return [...prev, event.key]
        }
        return prev
      })
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeysPressed((prev) => {
        return prev.filter((key) => key !== event.key)
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return useMemo(() => keysPressed.includes(key), [keysPressed, key])
}
