import { initializeDb } from "../database"
import { initializeDayjs } from "./dayjs"
import { hydrateDatabaseToStore, hydrateQueryClient, hydrateSettings } from "./hydrate"
import { migrateDatabase } from "./migration"
import { initializePlayer } from "./player"
/* eslint-disable no-console */
export const initializeApp = async () => {
  console.log(`Initialize...`)

  const now = Date.now()
  initializeDb()
  await apm("migrateDatabase", migrateDatabase)
  initializeDayjs()

  await apm("hydrateSettings", hydrateSettings)
  await apm("hydrateDatabaseToStore", hydrateDatabaseToStore)
  await apm("hydrateQueryClient", hydrateQueryClient)

  const loadingTime = Date.now() - now
  console.log(`Initialize done,`, `${loadingTime}ms`)

  await apm("initializePlayer", initializePlayer)
}

const apm = async (label: string, fn: () => Promise<any> | any) => {
  const start = Date.now()
  const result = await fn()
  const end = Date.now()
  console.log(`${label} took ${end - start}ms`)
  return result
}
