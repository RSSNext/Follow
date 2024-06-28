import { BaseModel } from "../model"
import { DB_EntrySchema } from "../schemas"

class ModelStatic extends BaseModel<"feeds"> {
  constructor() {
    super("feeds", DB_EntrySchema)
  }
}

export const feedModel = new ModelStatic()
