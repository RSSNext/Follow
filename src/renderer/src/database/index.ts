import { browserDB } from "./db"

export * from "./db"
export * from "./models"
export * from "./schemas"

export const runTransactionInScope = (
  fn: (db: typeof browserDB) => any,

) => {
  if (!dbIsReady) {
    // Or, push to waiting queue
    return
  }
  fn(browserDB)
}
