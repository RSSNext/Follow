import type { FeedViewType } from "~/lib/enum"
import type { InboxModel } from "~/models"

import { useInboxStore } from "./store"

export const useInboxById = (inboxId: Nullable<string>): InboxModel | null =>
  useInboxStore((state) => (inboxId ? state.inboxes[inboxId] : null))

export const useInboxByView = (view: FeedViewType) => {
  return useInboxStore((state) => (view === 0 ? Object.values(state.inboxes) : []))
}
