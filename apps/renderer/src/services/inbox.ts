import { browserDB } from "~/database"
import type { InboxModel } from "~/models/types"

import { BaseService } from "./base"
import { CleanerService } from "./cleaner"

class ServiceStatic extends BaseService<{ id: string }> {
  constructor() {
    super(browserDB.inboxes)
  }

  override async upsertMany(data: InboxModel[]) {
    CleanerService.reset(data.map((d) => ({ type: "feed", id: d.id! })))

    return this.table.bulkPut(data)
  }

  override async findAll() {
    return super.findAll() as unknown as InboxModel[]
  }

  override async upsert(data: InboxModel): Promise<string | null> {
    if (!data.id) return null
    CleanerService.reset([{ type: "feed", id: data.id }])
    return this.table.put(data)
  }

  async bulkDelete(ids: string[]) {
    return this.table.bulkDelete(ids)
  }
}

export const InboxService = new ServiceStatic()
