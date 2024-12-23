import { FeedViewType } from "@follow/constants"
import { atom, useAtomValue } from "jotai"

export const viewAtom = atom<FeedViewType>(FeedViewType.Articles)

export const useCurrentView = () => {
  return useAtomValue(viewAtom)
}

export const offsetAtom = atom<number>(0)
