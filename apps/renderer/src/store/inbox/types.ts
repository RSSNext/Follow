import type { InboxModel } from "~/models"

type InboxId = string

export interface InboxState {
  inboxes: Record<InboxId, InboxModel>
}
