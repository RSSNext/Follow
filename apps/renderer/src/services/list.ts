import { omit } from "lodash-es"

import { browserDB } from "~/database"
import type { ListModel } from "~/models/types"
import { listActions } from "~/store/list"

import { BaseService } from "./base"
import { CleanerService } from "./cleaner"
import type { Hydable } from "./interface"

class ServiceStatic extends BaseService<{ id: string }> implements Hydable {
  constructor() {
    super(browserDB.lists)
  }

  override async upsertMany(data: ListModel[]) {
    CleanerService.reset(data.map((d) => ({ type: "feed", id: d.id! })))

    // FIXME The backend should not pass these computed attributes, and these need to be removed here.
    // Subsequent refactoring of the backend data flow should not nest computed attributes
    return this.table.bulkPut(data.map((d) => omit(d, "owner")))
  }

  override async findAll() {
    return super.findAll() as unknown as ListModel[]
  }

  override async upsert(data: ListModel): Promise<string | null> {
    if (!data.id) return null
    CleanerService.reset([{ type: "feed", id: data.id }])
    return this.table.put(omit(data, "owner"))
  }

  async bulkDelete(ids: string[]) {
    return this.table.bulkDelete(ids)
  }

  async hydrate() {
    const lists = await ListService.findAll()
    listActions.upsertMany(lists)
  }
}

export const ListService = new ServiceStatic()
