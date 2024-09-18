import { createContext } from "use-context-selector"

import { FeedViewType } from "~/lib/enum"

export interface EntryContentContext {
  entryId: string
  feedId: string

  audioSrc?: string

  view: FeedViewType
}
const defaultContextValue: EntryContentContext = {
  entryId: "",
  feedId: "",
  view: FeedViewType.Articles,
}
export const EntryContentContext = createContext<EntryContentContext>(defaultContextValue)

export const EntryContentProvider: Component<EntryContentContext> = ({ children, ...value }) => (
  <EntryContentContext.Provider value={value}>{children}</EntryContentContext.Provider>
)
