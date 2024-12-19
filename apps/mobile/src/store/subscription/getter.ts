import type { SubscriptionModel } from "@/src/database/schemas/types"

import { useSubscriptionStore } from "./store"

const get = useSubscriptionStore.getState
export const getSubscription = (id: string): SubscriptionModel | null => {
  return get().data[id] || null
}
