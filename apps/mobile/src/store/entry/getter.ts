import type { EntrySchema } from "@/src/database/schemas/types"

import { useEntryStore } from "./store"

const get = useEntryStore.getState

export const getEntry = (id: string): EntrySchema | null => {
  return get().data[id] || null
}
