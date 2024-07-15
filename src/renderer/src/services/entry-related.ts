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

type IdToIdRecord = Record<string, string>
type IdToBooleanRecord = Record<string, boolean>
type IdToAnyObjectRecord = Record<string, Record<string, any>>
class ServiceStatic {
  async findAll(type: EntryRelatedKey.FEED_ID): Promise<IdToIdRecord>
  async findAll(type: EntryRelatedKey.READ): Promise<IdToBooleanRecord>
  async findAll(type: EntryRelatedKey.COLLECTION): Promise<IdToAnyObjectRecord>

  async findAll(type: EntryRelatedKey): Promise<Record<string, any>> {
    const data = await entryRelatedModel.table.get(type)
    return data ? data.data : {}
  }

  /**
   *
   * @param data key is entryId, value is read status
   * @returns
   */
  async upsert(
    type: EntryRelatedKey.READ,
    data: IdToBooleanRecord
  ): Promise<void>
  async upsert(
    type: EntryRelatedKey.FEED_ID,
    data: IdToIdRecord
  ): Promise<void>
  async upsert(
    type: EntryRelatedKey.COLLECTION,
    data: IdToAnyObjectRecord
  ): Promise<void>
  async upsert(type: any, data: Record<string, any>) {
    const oldData = await this.findAll(type)

    return entryRelatedModel.table.put({
      data: { ...oldData, ...data },
      id: type,
    })
  }

  async deleteItem(type: EntryRelatedKey, key: string) {
    const oldData = await this.findAll(type as any)
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
