import { BaseModel } from "../model"
import { DB_BaseSchema } from "../schemas"

class ModelStatic extends BaseModel<"feedEntries"> {
  constructor() {
    super("feedEntries", DB_BaseSchema)
  }
}

export const feedEntriesModel = new ModelStatic()
