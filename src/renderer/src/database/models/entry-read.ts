import { BaseModel } from "../model"
import { DB_EntrySchema } from "../schemas"

class ModelStatic extends BaseModel<"entryReads"> {
  constructor() {
    super("entryReads", DB_EntrySchema)
  }
}

export const entryReadsModel = new ModelStatic()
