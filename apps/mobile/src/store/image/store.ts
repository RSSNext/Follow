import ImageColors from "react-native-image-colors"

import type { ImageSchema } from "@/src/database/schemas/types"
import { ImagesService } from "@/src/services/image"

import { createImmerSetter, createTransaction, createZustandStore } from "../internal/helper"

export type ImageModel = ImageSchema
type ImageStore = {
  images: Record<string, ImageModel>
}

export const useImagesStore = createZustandStore<ImageStore>("images")(() => ({
  images: {},
}))

// const set = useUserStore.setState
const immerSet = createImmerSetter(useImagesStore)

class ImageSyncService {
  async getColors(url?: string) {
    if (!url) {
      return
    }
    const result = await ImageColors.getColors(url, { cache: true })
    await imageActions.upsertMany([{ url, colors: result }])
    return result
  }
}

class ImageActions {
  upsertManyInSession(images: ImageModel[]) {
    immerSet((state) => {
      for (const image of images) {
        state.images[image.url] = image
      }
    })
  }

  async upsertMany(images: ImageModel[]) {
    const tx = createTransaction()
    tx.store(() => this.upsertManyInSession(images))
    tx.persist(() => ImagesService.upsertMany(images))
    await tx.run()
  }
}

export const imageSyncService = new ImageSyncService()
export const imageActions = new ImageActions()
