import type { FeedViewType } from "~/lib/enum"

export type FeedListProps = {
  view: number
  data: Record<string, string[]>
  categoryOpenStateData: Record<string, boolean>
}
export type SortBy = "count" | "alphabetical"

export type ListListProps = {
  view: FeedViewType
  data: Record<string, string[]>
}
