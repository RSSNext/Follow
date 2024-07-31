import { useContext } from "react"

import { EntryContentContext } from "./provider"

export const useEntryContentContext = () => {
  const ctx = useContext(EntryContentContext)
  if (!ctx) {
    throw new Error(
      "useEntryContentContext must be used within EntryContentProvider",
    )
  }
  return ctx
}
