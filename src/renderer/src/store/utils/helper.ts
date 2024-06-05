import { del, get, set } from "idb-keyval"
import type { StateCreator } from "zustand"
import type { StateStorage } from "zustand/middleware"
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
  ) =>
    (store: T) => {
      const newStore = createWithEqualityFn(
        persist<S>(store, { name, storage: zustandStorage }),
        shallow,
      )

      // const newStore = create(persist(store, { name, storage: zustandStorage }))
      Object.assign(window, {
        [`__${name}`]() {
          return newStore.getState()
        },
      })
      return newStore
    }
