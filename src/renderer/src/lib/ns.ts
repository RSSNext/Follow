const ns = "follow"
export const getStorageNS = (key: string) => `${ns}:${key}`
/**
 * @deprecated Use `getStorageNS` instead.
 */
export const buildStorageKey = getStorageNS

export const clearStorage = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(ns)) {
      localStorage.removeItem(key)
    }
  }
}
