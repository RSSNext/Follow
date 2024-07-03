import { BaseModel } from "../model"
import { DB_BaseSchema } from "../schemas"

class ModelStatic extends BaseModel<"subscriptions"> {
  constructor() {
    super("subscriptions", DB_BaseSchema)
  }
}

export const subscriptionModel = new ModelStatic()
