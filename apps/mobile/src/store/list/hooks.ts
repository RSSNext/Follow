import { useListStore } from "./store"

export const useList = (id: string) => {
  return useListStore((state) => {
    return state.lists[id]
  })
}
