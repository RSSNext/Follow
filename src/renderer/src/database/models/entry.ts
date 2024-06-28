import { BaseModel } from "../model"
import { DB_EntrySchema } from "../schemas"

class EntryModelStatic extends BaseModel<"entries"> {
  constructor() {
    super("entries", DB_EntrySchema)
  }
}

export const entryModel = new EntryModelStatic()
