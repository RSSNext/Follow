import { FeedViewType } from "@follow/constants"
import { atom } from "jotai"

export const viewAtom = atom<FeedViewType>(FeedViewType.Articles)
