import { del, get, set } from "idb-keyval"
import type { StateCreator } from "zustand"
import type { PersistOptions, StateStorage } from "zustand/middleware"
import { createJSONStorage, persist } from "zustand/middleware"
import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

export const dbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> =>
    (await get(name)) || null,
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name)
  },
}

export const zustandStorage = createJSONStorage(() => dbStorage) as any

export const createZustandStore =
  <
    S,
    T extends StateCreator<
      S,
      [["zustand/persist", unknown]],
      []
    > = StateCreator<S, [["zustand/persist", unknown]], []>,
  >(
    name: string,
    options?: Partial<PersistOptions<S>>,
  ) =>
    (store: T) => {
      const newStore = createWithEqualityFn(
        persist<S>(store, {
          name,
          storage: zustandStorage,
          ...options,
        }),
        shallow,
      )

      Object.assign(window, {
        [`__${name}`]() {
          return newStore.getState()
        },
      })
      return newStore
    }
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T]

type FunctionProps<T> = Pick<T, FunctionKeys<T>>
export const getStoreActions = <T extends { getState: () => any }>(
  store: T,
): FunctionProps<ReturnType<T["getState"]>> => {
  const actions = {}
  const state = store.getState()
  for (const key in state) {
    if (typeof state[key] === "function") {
      actions[key] = state[key]
    }
  }

  return actions as any
}
