import { eq } from "drizzle-orm"

import { db } from "../database"
import { summariesTable } from "../database/schemas"
import type { SummarySchema } from "../database/schemas/types"

class SummaryServiceStatic {
  async insertSummary(data: Omit<SummarySchema, "createdAt">) {
    await db
      .insert(summariesTable)
      .values({
        ...data,
        createdAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: [summariesTable.entryId, summariesTable.language],
        set: {
          summary: data.summary,
        },
      })
  }

  async getSummary(entryId: string) {
    const summary = await db.query.summariesTable.findFirst({
      where: eq(summariesTable.entryId, entryId),
    })

    return summary
  }

  async deleteSummary(entryId: string) {
    await db.delete(summariesTable).where(eq(summariesTable.entryId, entryId))
  }
}

export const summaryService = new SummaryServiceStatic()
