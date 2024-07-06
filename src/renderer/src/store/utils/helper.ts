import type { StateCreator } from "zustand"
import type { PersistStorage } from "zustand/middleware"
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

const storeMap = {} as Record<string, UseBoundStoreWithEqualityFn<any>>

export const createZustandStore =
  <S, T extends StateCreator<S, [], []> = StateCreator<S, [], []>>(
    name: string,
  ) =>
    (store: T) => {
      const newStore = createWithEqualityFn(store, shallow)

      storeMap[name] = newStore
      window.store =
      window.store ||
      new Proxy(
        {},
        {
          get(_, prop) {
            if (prop in storeMap) {
              return storeMap[prop as string].getState()
            }
            return
          },
        },
      )

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
