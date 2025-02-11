import type { FeedViewType } from "@follow/constants"

import type { CollectionSchema } from "@/src/database/schemas/types"
import { apiClient } from "@/src/lib/api-fetch"
import { CollectionService } from "@/src/services/collection"

import { createTransaction, createZustandStore } from "../internal/helper"

interface CollectionState {
  collections: Record<string, CollectionSchema>
}

const defaultState = {
  collections: {},
}

export const useCollectionStore = createZustandStore<CollectionState>("collection")(
  () => defaultState,
)

// const get = useCollectionStore.getState
const set = useCollectionStore.setState

class CollectionSyncService {
  async starEntry(collection: CollectionSchema, view: FeedViewType) {
    await apiClient.collections.$post({
      json: {
        entryId: collection.entryId,
        view,
      },
    })

    await collectionActions.upsertMany([collection])
    return
  }

  async unstarEntry(collection: CollectionSchema) {
    await apiClient.collections.$delete({
      json: {
        entryId: collection.entryId,
      },
    })

    await collectionActions.delete(collection.entryId)
  }
}

class CollectionActions {
  async upsertManyInSession(collections: CollectionSchema[]) {
    const state = useCollectionStore.getState()
    const nextCollections: CollectionState["collections"] = {
      ...state.collections,
    }
    collections.forEach((collection) => {
      if (!collection.entryId) return
      nextCollections[collection.entryId] = collection
    })
    set({
      ...state,
      collections: nextCollections,
    })
  }

  async upsertMany(collections: CollectionSchema[]) {
    const tx = createTransaction()
    tx.store(() => {
      this.upsertManyInSession(collections)
    })
    tx.persist(() => {
      return CollectionService.upsertMany(collections)
    })
    tx.run()
  }

  async deleteInSession(entryId: string) {
    const state = useCollectionStore.getState()
    const nextCollections: CollectionState["collections"] = {
      ...state.collections,
    }
    delete nextCollections[entryId]
    set({
      ...state,
      collections: nextCollections,
    })
  }

  async delete(entryId: string) {
    const tx = createTransaction()
    tx.store(() => {
      this.deleteInSession(entryId)
    })
    tx.persist(() => {
      return CollectionService.delete(entryId)
    })
    tx.run()
  }

  reset() {
    set(defaultState)
  }
}

export const collectionActions = new CollectionActions()
export const collectionSyncService = new CollectionSyncService()
