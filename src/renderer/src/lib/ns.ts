const ns = "follow"
export const getStorageNS = (key: string) => `${ns}:${key}`
/**
 * @deprecated Use `getStorageNS` instead.
 */
export const buildStorageKey = getStorageNS
