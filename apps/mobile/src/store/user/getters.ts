import { useUserStore } from "./store"

export const whoami = () => {
  return useUserStore.getState().whoami
}
