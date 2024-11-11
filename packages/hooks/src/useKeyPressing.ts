import { useEffect, useMemo, useState } from "react"

export function useKeyPressing(key: string) {
  const [keysPressed, setKeysPressed] = useState(() => new Set())

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeysPressed((prev) => {
        const newSet = new Set(prev)
        newSet.add(event.key)
        return newSet
      })
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeysPressed((prev) => {
        const newSet = new Set(prev)
        newSet.delete(event.key)
        return newSet
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return useMemo(() => keysPressed.has(key), [keysPressed, key])
}
