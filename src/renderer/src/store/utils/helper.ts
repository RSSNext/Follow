import type { StateCreator, StoreApi } from "zustand"
import type {
  PersistOptions,
  PersistStorage,
} from "zustand/middleware"
import { persist } from "zustand/middleware"
import { shallow } from "zustand/shallow"
import type { UseBoundStoreWithEqualityFn } from "zustand/traditional"
import { createWithEqualityFn } from "zustand/traditional"

declare const window: any
export const localStorage: PersistStorage<any> = {
  getItem: (name: string) => {
    const data = window.localStorage.getItem(name)

    if (data === null) {
      return null
    }

    return JSON.parse(data)
  },
  setItem: (name, value) => {
    window.localStorage.setItem(name, JSON.stringify(value))
  },
  removeItem: (name: string) => {
    window.localStorage.removeItem(name)
  },
}

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
    options?: Partial<PersistOptions<S> & {
      persist?: boolean
    }>,
  ) =>
    (store: T) => {
      const newStore = options?.persist ?
        createWithEqualityFn(
          persist<S>(store, {
            name,
            storage: localStorage,
            ...options,
          }),
          shallow,
        ) :
        createWithEqualityFn(store as any, shallow)

      window.store = window.store || {}
      Object.assign(window.store, {
        [name]() {
          return newStore.getState()
        },
      })
      return newStore as unknown as UseBoundStoreWithEqualityFn<StoreApi<
        S
      >>
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
