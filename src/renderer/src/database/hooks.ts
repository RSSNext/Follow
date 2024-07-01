import { createAtomHooks, jotaiStore } from "@renderer/lib/jotai"
import { getStorageNS } from "@renderer/lib/ns"
import { atomWithStorage } from "jotai/utils"

const SHOULD_USE_INDEXED_DB_KEY = getStorageNS("shouldUseIndexedDB")

export const [
  __shouldUseIndexedDBAtom,
  useShouldUseIndexedDB,
  useShouldUseIndexedDBValue,
  useSetShouldUseIndexedDB,
  getShouldUseIndexedDB,
  setShouldUseIndexedDB,
] = createAtomHooks(atomWithStorage(SHOULD_USE_INDEXED_DB_KEY, false))

export const subscribeShouldUseIndexedDB = (callback: (value: boolean) => void) => jotaiStore.sub(__shouldUseIndexedDBAtom, () => callback(getShouldUseIndexedDB()))
