import { useCollectionStore } from "./store"

export const useCollectionEntry = (entryId: string) => {
  return useCollectionStore((state) => {
    return state.collections[entryId]
  })
}

export const useIsEntryStarred = (entryId: string) => {
  return useCollectionStore((state) => {
    return !!state.collections[entryId]
  })
}
