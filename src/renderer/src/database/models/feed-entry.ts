import { BaseModel } from "../model"
import { DB_EntrySchema } from "../schemas"

class ModelStatic extends BaseModel<"feedEntries"> {
  constructor() {
    super("feedEntries", DB_EntrySchema)
  }
}

export const feedEntriesModel = new ModelStatic()
