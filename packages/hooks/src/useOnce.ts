import { useSingleton } from "foxact/use-singleton"

export const useOnce = (fn: () => any) => {
  useSingleton(async () => {
    await fn()
    return true
  })
}
