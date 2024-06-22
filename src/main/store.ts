import Store from "electron-store"

interface StoreType {
  set: (key: string, value: any) => void
  get: (key: string) => any
}
// https://github.com/sindresorhus/electron-store/issues/276
export const store = new Store() as unknown as StoreType
