import { entryReadsModel } from "@renderer/database"

import { BaseService } from "./base"

class ServiceStatic extends BaseService<{ id: string, read: boolean }> {
  constructor() {
    super(entryReadsModel.table)
  }
}

export const EntryReadService = new ServiceStatic()
