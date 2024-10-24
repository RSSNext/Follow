import type { InboxModel } from "@follow/models/types"

import { useInboxStore } from "./store"

export const useInboxById = (inboxId: Nullable<string>): InboxModel | null =>
  useInboxStore((state) => (inboxId ? state.inboxes[inboxId] : null))
