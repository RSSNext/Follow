import { entryRelatedModel } from "@renderer/database"

export enum EntryRelatedKey {
  READ = "READ",
  FEED_ID = "FEED_ID",
  COLLECTION = "COLLECTION",
}

// eslint-disable-next-line unused-imports/no-unused-vars
type Model = {
  id: EntryRelatedKey
  data: Record<string, any>
}
class ServiceStatic {
  async findAll(
    type: EntryRelatedKey,
  ): Promise<Record<string, any>> {
    const data = await entryRelatedModel.table.get(type)
    return data ? data.data : {}
  }

  /**
   *
   * @param data key is entryId, value is read status
   * @returns
   */
  async upsert(type: EntryRelatedKey, data: Record<string, any>) {
    const oldData = await this.findAll(type)

    return entryRelatedModel.table.put({
      data: { ...oldData, ...data },
      id: type,
    })
  }

  async deleteItem(
    type: EntryRelatedKey,
    key: string,
  ) {
    const oldData = await this.findAll(type)
    delete oldData[key]

    return entryRelatedModel.table.put({
      data: oldData,
      id: type,
    })
  }

  async clear() {
    return entryRelatedModel.table.clear()
  }
}

export const EntryRelatedService = new ServiceStatic()
