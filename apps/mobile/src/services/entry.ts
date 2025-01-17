import { eq, sql } from "drizzle-orm"

import { db } from "../database"
import { entriesTable } from "../database/schemas"
import type { EntrySchema } from "../database/schemas/types"
import { dbStoreMorph } from "../morph/db-store"
import { entryActions } from "../store/entry/store"
import type { Hydratable, Resetable } from "./internal/base"

class EntryServiceStatic implements Hydratable, Resetable {
  async reset() {
    await db.delete(entriesTable).execute()
  }

  async upsertMany(entries: EntrySchema[]) {
    if (entries.length === 0) return
    await db
      .insert(entriesTable)
      .values(entries)
      .onConflictDoUpdate({
        target: [entriesTable.id],
        set: {
          title: sql`excluded.title`,
          url: sql`excluded.url`,
          content: sql`excluded.content`,
          description: sql`excluded.description`,
          guid: sql`excluded.guid`,
          author: sql`excluded.author`,
          authorUrl: sql`excluded.author_url`,
          authorAvatar: sql`excluded.author_avatar`,
          insertedAt: sql`excluded.inserted_at`,
          publishedAt: sql`excluded.published_at`,
          media: sql`excluded.media`,
          categories: sql`excluded.categories`,
          attachments: sql`excluded.attachments`,
          extra: sql`excluded.extra`,
          language: sql`excluded.language`,
          feedId: sql`excluded.feed_id`,
          inboxHandle: sql`excluded.inbox_handle`,
          read: sql`excluded.read`,
        },
      })
  }

  async patch(entry: Partial<EntrySchema> & { id: string }) {
    await db.update(entriesTable).set(entry).where(eq(entriesTable.id, entry.id))
  }

  async hydrate() {
    const entries = await db.query.entriesTable.findMany()
    entryActions.upsertManyInSession(entries.map((e) => dbStoreMorph.toEntryModel(e)))
  }
}

export const EntryService = new EntryServiceStatic()
