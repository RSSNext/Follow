import { BaseModel } from "../model"
import { DB_EntrySchema } from "../schemas"

class ModelStatic extends BaseModel<"entryRelated"> {
  constructor() {
    super("entryRelated", DB_EntrySchema)
  }
}

export const entryRelatedModel = new ModelStatic()
