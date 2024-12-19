import type { SubscriptionSchema } from "@/src/database/schemas/types"

import { useSubscriptionStore } from "./store"

const get = useSubscriptionStore.getState
export const getSubscription = (id: string): SubscriptionSchema | null => {
  return get().data[id] || null
}
