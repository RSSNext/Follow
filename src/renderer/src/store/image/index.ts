import { createZustandStore } from "../utils/helper"

export interface StoreImageType {
  src: string
  width: number
  height: number
  ratio: number
}
interface State {
  images: Record<string, StoreImageType>
}
export const useImageStore = createZustandStore<State>("image")(() => ({
  images: {},
}))

const set = useImageStore.setState
const get = useImageStore.getState

class ImageActions {
  getImage(src: string) {
    return get().images[src]
  }

  saveImages(images: StoreImageType[]) {
    set((state) => {
      const newImages = { ...state.images }
      for (const image of images) {
        newImages[image.src] = image
      }
      return { images: newImages }
    })
  }
}
export const imageActions = new ImageActions()
/// // HOOKS
export const useImageDimensions = (url: string) =>
  useImageStore((state) => state.images[url])
export const useImagesHasDimensions = (urls: string[]) =>
  useImageStore((state) => urls.every((url) => state.images[url]))
