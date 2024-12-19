import type { ListSchema } from "../database/schemas/types"
import type { ListModel } from "../store/list/store"

class StoreDbMorph {
  toListSchema(list: ListModel): ListSchema {
    return {
      ...list,
      feedIds: JSON.stringify(list.feedIds),
    }
  }
}

export const storeDbMorph = new StoreDbMorph()
