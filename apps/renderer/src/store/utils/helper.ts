/* eslint-disable no-unsafe-finally */
import { produce } from "immer"
import { unstable_batchedUpdates } from "react-dom"
import type { StateCreator, StoreApi, UseBoundStore } from "zustand"
import type { PersistStorage } from "zustand/middleware"
import { devtools } from "zustand/middleware"
import { shallow } from "zustand/shallow"
import type { UseBoundStoreWithEqualityFn } from "zustand/traditional"
import { createWithEqualityFn } from "zustand/traditional"

import { runTransactionInScope } from "~/database"

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
  <S, T extends StateCreator<S, [], []> = StateCreator<S, [], []>>(name: string) =>
  (store: T) => {
    const newStore = import.meta.env.DEV
      ? createWithEqualityFn(
          devtools(store, {
            enabled: DEBUG,
            name,
          }),
          shallow,
        )
      : createWithEqualityFn(store, shallow)

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
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
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
export const doMutationAndTransaction = async <M, T>(
  mutationFn: () => Promise<M>,
  transaction: () => Promise<T>,
  options?: MutationAndTranscationOptions,
): Promise<[M | null | void, T | null | void]> => {
  const isOnline = navigator.onLine
  const { waitMutation = false, doTranscationWhenMutationFail = !isOnline } = options || {}
  const wrappedTransaction = () => {
    const ret = runTransactionInScope(() => unstable_batchedUpdates(() => transaction()))

    if (ret instanceof Promise) {
      return ret
    }
    return null
  }
  const wrappedMutation = () => (isOnline ? mutationFn() : Promise.resolve())

  if (waitMutation) {
    let runTransactionOnce = false

    try {
      const mutationRet = await wrappedMutation()
      runTransactionOnce = true
      const transactionRet = await wrappedTransaction()
      return [mutationRet, transactionRet]
    } finally {
      if (!runTransactionOnce && doTranscationWhenMutationFail) {
        const transactionRet = await wrappedTransaction()

        return [null, transactionRet]
      }
      return [null, null]
    }
  } else {
    return await Promise.all([wrappedMutation(), wrappedTransaction()])
  }
}

export function createImmerSetter<T>(useStore: UseBoundStore<StoreApi<T>>) {
  return (updater: (state: T) => void) =>
    useStore.setState((state) =>
      produce(state, (draft) => {
        updater(draft as T)
      }),
    )
}
