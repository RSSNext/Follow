import { useCollectionStore } from "./store"

export const useCollectionEntry = (entryId: string) => {
  return useCollectionStore((state) => {
    return state.collections[entryId]
  })
}

export const useIsEntryStared = (entryId: string) => {
  return useCollectionStore((state) => {
    return !!state.collections[entryId]
  })
}
