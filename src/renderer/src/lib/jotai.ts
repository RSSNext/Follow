import type { PrimitiveAtom } from "jotai"
import { createStore, useAtom, useAtomValue, useSetAtom } from "jotai"

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
