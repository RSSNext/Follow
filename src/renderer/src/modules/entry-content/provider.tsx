import { createContext, useContext } from "react"

interface ContextValue {
  entryId: string
  feedId: string

  audioSrc?: string
}
const EntryContentContext = createContext<ContextValue>(null!)

export const EntryContentProvider: Component<ContextValue> = ({
  children,
  ...value
}) => (
  <EntryContentContext.Provider value={value}>
    {children}
  </EntryContentContext.Provider>
)

export const useEntryContentContext = () => {
  const ctx = useContext(EntryContentContext)
  if (!ctx) {
    throw new Error(
      "useEntryContentContext must be used within EntryContentProvider",
    )
  }
  return ctx
}
