import { useUnreadStore } from "./store"

export const getUnreadCount = (id: string) => {
  const state = useUnreadStore.getState()
  return state.data[id] ?? 0
}
