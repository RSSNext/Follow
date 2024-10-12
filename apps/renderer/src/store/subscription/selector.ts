import type { useSubscriptionStore } from "./store"

type State = ReturnType<typeof useSubscriptionStore.getState>
export const subscriptionCategoryExistSelector = (name: string) => (state: State) =>
  state.categories.has(name)
