import { feedModel } from "@renderer/database/models"
import type { FeedModel } from "@renderer/models/types"

import { BaseService } from "./base"

type FeedModelWithId = FeedModel & { id: string }
class ServiceStatic extends BaseService<FeedModelWithId> {
  constructor() {
    super(feedModel.table)
  }

  override async upsertMany(data: FeedModel[]) {
    const filterData = data.filter((d) => d.id)
    this.table.bulkPut(filterData as FeedModelWithId[])
  }

  override upsert(data: FeedModel) {
    if (!data.id) return
    this.table.put(data as FeedModelWithId)
  }
}

export const FeedService = new ServiceStatic()
