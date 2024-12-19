import { inboxesTable } from "@/src/database/schemas"
import type { InboxSchema } from "@/src/database/schemas/types"

import { db } from "../database"
import { inboxActions } from "../store/inbox/store"
import type { Hydratable, Resetable } from "./internal/base"
import { conflictUpdateAllExcept } from "./internal/utils"

class InboxServiceStatic implements Hydratable, Resetable {
  async reset() {
    await db.delete(inboxesTable).execute()
  }
  async getInbox(): Promise<InboxSchema[]> {
    return await db.select().from(inboxesTable)
  }
  async hydrate() {
    const inboxes = await db.query.inboxesTable.findMany()
    inboxActions.upsertMany(inboxes)
  }

  async upsertMany(inboxes: InboxSchema[]) {
    await db
      .insert(inboxesTable)
      .values(inboxes)
      .onConflictDoUpdate({
        target: [inboxesTable.id],
        set: conflictUpdateAllExcept(inboxesTable, ["id"]),
      })
  }
}

export const InboxService = new InboxServiceStatic()