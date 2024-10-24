import type { FeedModel, FeedOrListModel } from "@follow/models/types"

import { browserDB } from "~/database"
import { feedActions } from "~/store/feed"

import { BaseService } from "./base"
import { CleanerService } from "./cleaner"
import type { Hydable } from "./interface"

type FeedModelWithId = FeedModel & { id: string }
class ServiceStatic extends BaseService<FeedModelWithId> implements Hydable {
  constructor() {
    super(browserDB.feeds)
  }

  override async upsertMany(data: FeedOrListModel[]) {
    const filterData = data.filter((d) => d.id)

    CleanerService.reset(filterData.map((d) => ({ type: "feed", id: d.id! })))

    return this.table.bulkPut(filterData as FeedModelWithId[])
  }

  override async upsert(data: FeedOrListModel): Promise<string | null> {
    if (!data.id) return null
    CleanerService.reset([{ type: "feed", id: data.id }])
    return this.table.put(data as FeedModelWithId)
  }

  async bulkDelete(ids: string[]) {
    return this.table.bulkDelete(ids)
  }

  async hydrate() {
    const feeds = await FeedService.findAll()
    feedActions.upsertMany(feeds)
  }
}

export const FeedService = new ServiceStatic()
