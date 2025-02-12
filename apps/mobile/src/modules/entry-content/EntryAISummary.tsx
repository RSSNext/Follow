import { useAtomValue } from "jotai"
import type { FC } from "react"

import { SummaryGeneratingStatus } from "@/src/store/summary/enum"
import { useSummary } from "@/src/store/summary/hooks"
import { useSummaryStore } from "@/src/store/summary/store"

import { AISummary } from "../ai/summary"
import { useEntryContentContext } from "./ctx"

export const EntryAISummary: FC<{
  entryId: string
}> = ({ entryId }) => {
  const ctx = useEntryContentContext()
  const showAISummary = useAtomValue(ctx.showAISummaryAtom)
  const summary = useSummary(entryId)

  const status = useSummaryStore((state) => state.generatingStatus[entryId])
  if (!showAISummary) return null

  return (
    <AISummary
      className="mb-3"
      summary={summary?.summary || ""}
      pending={status === SummaryGeneratingStatus.Pending}
      error={status === SummaryGeneratingStatus.Error ? "Failed to generate summary" : undefined}
    />
  )
}
