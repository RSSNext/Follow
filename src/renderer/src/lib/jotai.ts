import type { Atom, PrimitiveAtom } from "jotai"
import { createStore, useAtom, useAtomValue, useSetAtom } from "jotai"
import { selectAtom } from "jotai/utils"
import { useCallback } from "react"

export const jotaiStore = createStore()

export const createAtomAccessor = <T>(atom: PrimitiveAtom<T>) =>
  [
    () => jotaiStore.get(atom),
    (value: T) => jotaiStore.set(atom, value),
  ] as const

/**
 * @param atom - jotai
 * @returns - [atom, useAtom, useAtomValue, useSetAtom, jotaiStore.get, jotaiStore.set]
 */
export const createAtomHooks = <T>(atom: PrimitiveAtom<T>) =>
  [
    atom,
    () => useAtom(atom),
    () => useAtomValue(atom),
    () => useSetAtom(atom),
    ...createAtomAccessor(atom),
  ] as const

export const createAtomSelector = <T>(atom: Atom<T>) => {
  const useHook = <R>(selector: (a: T) => R, deps: any[] = []) =>
    useAtomValue(
      selectAtom(
        atom,
        useCallback((a) => selector(a as T), deps),
      ),
    )

  useHook.__atom = atom
  return useHook
}
