import { useFeedStore } from "./store"

export const useFeed = (id: string) => {
  return useFeedStore((state) => {
    return state.feeds[id]
  })
}
