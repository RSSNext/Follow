import { initializeDayjs } from "./dayjs"
import { hydrateDatabaseToStore, hydrateSettings } from "./hydrate"
/* eslint-disable no-console */
export const initializeApp = async () => {
  console.log(`Initialize...`)

  const now = Date.now()
  initializeDayjs()

  await apm("hydrateSettings", hydrateSettings)
  await apm("hydrateDatabaseToStore", hydrateDatabaseToStore)

  const loadingTime = Date.now() - now
  console.log(`Initialize done,`, `${loadingTime}ms`)
}

const apm = async (label: string, fn: () => Promise<any> | any) => {
  const start = Date.now()
  const result = await fn()
  const end = Date.now()
  console.log(`${label} took ${end - start}ms`)
  return result
}
