import { whoami } from "../user/getters"
import { useListStore } from "./store"

export const useList = (id: string) => {
  return useListStore((state) => {
    return state.lists[id]
  })
}

export const useIsOwnList = (id: string) => {
  return useListStore((state) => {
    return state.lists[id]?.userId === whoami()?.id
  })
}
