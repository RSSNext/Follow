import { BaseModel } from "../model"
import { DB_BaseSchema } from "../schemas"

class ModelStatic extends BaseModel<"feeds"> {
  constructor() {
    super("feeds", DB_BaseSchema)
  }
}

export const feedModel = new ModelStatic()
