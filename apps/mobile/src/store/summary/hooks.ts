import { useSummaryStore } from "./store"

export const useSummary = (entryId: string) => {
  const summary = useSummaryStore((state) => state.data[entryId])
  return summary
}

export const useSummaryStatus = (entryId: string) => {
  const status = useSummaryStore((state) => state.generatingStatus[entryId])
  return status
}
