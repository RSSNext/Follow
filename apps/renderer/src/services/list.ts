import { browserDB } from "~/database"
import type { ListModel } from "~/models/types"

import { BaseService } from "./base"
import { CleanerService } from "./cleaner"

type ListModelWithId = ListModel & { id: string }
class ServiceStatic extends BaseService<ListModelWithId> {
  constructor() {
    super(browserDB.lists)
  }

  override async upsertMany(data: ListModel[]) {
    CleanerService.reset(data.map((d) => ({ type: "list", id: d.id })))

    return this.table.bulkPut(data as ListModelWithId[])
  }

  override async upsert(data: ListModel): Promise<string | null> {
    if (!data.id) return null
    CleanerService.reset([{ type: "list", id: data.id }])
    return this.table.put(data as ListModelWithId)
  }

  async bulkDelete(ids: string[]) {
    return this.table.bulkDelete(ids)
  }
}

export const ListService = new ServiceStatic()
