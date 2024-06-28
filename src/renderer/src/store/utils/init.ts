import { browserDB, getShouldUseIndexedDB, subscribeShouldUseIndexedDB } from "@renderer/database"

import { hydrateDatabaseToStore, setHydrated } from "./hydrate"

const cleanup = subscribeShouldUseIndexedDB((value) => {
  if (!value) {
    browserDB.delete()
    setHydrated(false)
    return
  }
  setHydrated(true)
})
export const initializeDbAndStore = async () => {
  if (getShouldUseIndexedDB()) {
    await hydrateDatabaseToStore()
  }
}

import.meta.hot?.dispose(cleanup)
