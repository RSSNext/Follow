import { createStore, get, set } from "idb-keyval"

import type { StoreImageType } from "."

const db = createStore("FOLLOW_IMAGE_DIMENSIONS", "image-dimensions")

export const getImageDimensionsFromDb = async (url: string) => await get(url, db)

export const saveImageDimensionsToDb = async (
  url: string,
  dimensions: StoreImageType,
) => await set(url, dimensions, db)
