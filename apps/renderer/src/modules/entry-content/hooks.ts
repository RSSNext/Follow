import { isDev } from "@renderer/constants"
import { useContext, useContextSelector } from "use-context-selector"

import { EntryContentContext } from "./provider"

export const useEntryContentContext = () => {
  const ctx = useContext(EntryContentContext)
  if (!ctx && isDev) {
    console.error("Notice: EntryContentContext is not provided.", new Error("x").stack)
  }
  return ctx
}

export const useEntryContentContextSelector = <T>(selector: (ctx: EntryContentContext) => T) =>
  useContextSelector(EntryContentContext, selector)
