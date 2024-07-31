import type { FeedViewType } from "@renderer/lib/enum"
import { createContext } from "react"

export interface EntryContentContext {
  entryId: string
  feedId: string

  audioSrc?: string

  view: FeedViewType
}
export const EntryContentContext = createContext<EntryContentContext>(null!)

export const EntryContentProvider: Component<EntryContentContext> = ({
  children,
  ...value
}) => (
  <EntryContentContext.Provider value={value}>
    {children}
  </EntryContentContext.Provider>
)
