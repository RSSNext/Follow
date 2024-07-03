import { BaseModel } from "../model"
import { DB_BaseSchema } from "../schemas"

class ModelStatic extends BaseModel<"entryRelated"> {
  constructor() {
    super("entryRelated", DB_BaseSchema)
  }
}

export const entryRelatedModel = new ModelStatic()
