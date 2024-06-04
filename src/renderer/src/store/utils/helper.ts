import { del, get, set } from "idb-keyval"
import type { StateStorage } from "zustand/middleware"
import { createJSONStorage } from "zustand/middleware"

export const dbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => (await get(name)) || null,
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name)
  },
}

export const createZustandStorage = () =>
  createJSONStorage(() => dbStorage) as any
