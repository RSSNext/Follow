import { runTransactionInScope } from "@renderer/database"
import { unstable_batchedUpdates } from "react-dom"
import type { StateCreator } from "zustand"
import type { PersistStorage } from "zustand/middleware"
import { devtools } from "zustand/middleware"
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
      const newStore = createWithEqualityFn(
        devtools(store, {
          enabled: process.env.NODE_ENV === "development",
          name,
        }),
        shallow,
      )

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

export type MutationAndTranscationOptions = {
  /**
   * If true, will wait for the mutation to finish before running the transaction
   */
  waitMutation?: boolean
  /**
   * If true, will run the transaction even if the mutation fails, useful in network offline
   */
  doTranscationWhenMutationFail?: boolean
}
export const doMutationAndTransaction = async (
  mutationFn: () => Promise<any>,
  transaction: () => Promise<any>,
  options?: MutationAndTranscationOptions,
) => {
  const {
    waitMutation = false,
    doTranscationWhenMutationFail = !navigator.onLine,
  } = options || {}
  const wrappedTransaction = () => runTransactionInScope(() => unstable_batchedUpdates(() => transaction()))

  if (waitMutation) {
    let runOnce = false
    await mutationFn()
      .then(() => {
        runOnce = true
        return wrappedTransaction()
      })
      .finally(() => {
        if (runOnce) return
        if (doTranscationWhenMutationFail) {
          return wrappedTransaction()
        }
        return
      })
  } else {
    await Promise.all([
      mutationFn(),
      wrappedTransaction(),
    ])
  }
}
