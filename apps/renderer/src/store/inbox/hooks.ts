import type { InboxModel } from "~/models"

import { useInboxStore } from "./store"

export const useInboxById = (inboxId: Nullable<string>): InboxModel | null =>
  useInboxStore((state) => (inboxId ? state.inboxes[inboxId] : null))
