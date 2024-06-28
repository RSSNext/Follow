import { BaseModel } from "../model"
import { DB_EntrySchema } from "../schemas"

class ModelStatic extends BaseModel<"subscriptions"> {
  constructor() {
    super("subscriptions", DB_EntrySchema)
  }
}

export const subscriptionModel = new ModelStatic()
