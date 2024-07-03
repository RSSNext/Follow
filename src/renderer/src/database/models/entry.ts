import { BaseModel } from "../model"
import { DB_BaseSchema } from "../schemas"

class EntryModelStatic extends BaseModel<"entries"> {
  constructor() {
    super("entries", DB_BaseSchema)
  }
}

export const entryModel = new EntryModelStatic()
