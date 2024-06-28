import type Dexie from "dexie"
import type { UpdateSpec } from "dexie"

export abstract class BaseService<T extends { id: string }> {
  constructor(public readonly table: Dexie.Table<T, string>) {}

  async create(data: T) {
    return this.table.add(data)
  }

  async insertMany(data: T[]) {
    return this.table.bulkAdd(data)
  }

  // @ts-expect-error
  async upsert(data: T): Promise<void> | void {
    this.table.put(data)
  }

  async upsertMany(data: T[]) {
    this.table.bulkPut(data)
  }

  async findAll() {
    return this.table.toArray()
  }

  async patch(id: string, data: Partial<T>) {
    const oldData = await this.table.get(id)
    if (!oldData) return
    await this.table.update(id, {
      ...oldData,
      ...data,
    } as unknown as UpdateSpec<T>)
  }
}
