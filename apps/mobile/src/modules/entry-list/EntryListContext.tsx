import type { FeedViewType } from "@follow/constants"
import { createContext, useContext } from "react"

export const EntryListContextViewContext = createContext<FeedViewType>(null!)

export const useEntryListContextView = () => {
  return useContext(EntryListContextViewContext)
}
