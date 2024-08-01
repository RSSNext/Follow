import { isDev } from "@renderer/constants"
import { useContext } from "react"

import { EntryContentContext } from "./provider"

export const useEntryContentContext = () => {
  const ctx = useContext(EntryContentContext)
  if (!ctx && isDev) {
    console.error("Notice: EntryContentContext is not provided.", new Error("x").stack)
  }
  return ctx
}
