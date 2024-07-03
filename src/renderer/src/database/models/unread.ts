import { BaseModel } from "../model"
import { DB_BaseSchema } from "../schemas"

class ModelStatic extends BaseModel<"feedUnreads"> {
  constructor() {
    super("feedUnreads", DB_BaseSchema)
  }
}

export const feedUnreadModel = new ModelStatic()
