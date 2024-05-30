import type { EntriesResponse } from "@renderer/lib/types"

export interface UniversalItemProps { entry: EntriesResponse[number] }

export type FilterTab = "all" | "unread"
