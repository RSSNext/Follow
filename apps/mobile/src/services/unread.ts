import { db } from "../database"
import { unreadTable } from "../database/schemas"
import type { UnreadSchema } from "../database/schemas/types"
import { unreadActions } from "../store/unread/store"
import type { Hydratable, Resetable } from "./internal/base"
import { conflictUpdateAllExcept } from "./internal/utils"

class UnreadServiceStatic implements Hydratable, Resetable {
  async reset() {
    await db.delete(unreadTable).execute()
  }
  async hydrate() {
    const unreads = await db.query.unreadTable.findMany()
    unreadActions.upsertManyInSession(unreads)
  }

  async upsertMany(unreads: UnreadSchema[]) {
    if (unreads.length === 0) return
    await db
      .insert(unreadTable)
      .values(unreads)
      .onConflictDoUpdate({
        target: [unreadTable.subscriptionId],
        set: conflictUpdateAllExcept(unreadTable, ["subscriptionId"]),
      })
  }
}

export const UnreadService = new UnreadServiceStatic()
