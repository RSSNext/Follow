import type { FeedViewType } from "@follow/constants"
import { createContext, useContext } from "react"

const ViewPageCurrentViewContext = createContext<FeedViewType>(null!)
export const ViewPageCurrentViewProvider = ViewPageCurrentViewContext.Provider
export const useViewPageCurrentView = () => useContext(ViewPageCurrentViewContext)
export const GroupedContext = createContext<string | null>(null)
