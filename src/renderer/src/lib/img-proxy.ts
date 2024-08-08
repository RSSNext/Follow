import { env } from "@env"
import { imageActions } from "@renderer/store/image"
import { imageRefererMatches } from "@shared/image"
import { AsyncQueue } from "@shared/queue"
import { createStore, get, set } from "idb-keyval"

export const getProxyUrl = ({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}) =>
  `${env.VITE_IMGPROXY_URL}/unsafe/${width}x${height}/${encodeURIComponent(
    url,
  )}`

export const replaceImgUrlIfNeed = (url: string) => {
  for (const rule of imageRefererMatches) {
    if (rule.url.test(url)) {
      return getProxyUrl({ url, width: 0, height: 0 })
    }
  }
  return url
}
const asyncQueue = new AsyncQueue(10)
const urlIsProcessing = new Set<string>()
const db = createStore("FOLLOW_IMAGE_DIMENSIONS", "image-dimensions")

export const fetchImageDimensions = async (url: string) => {
  const image = imageActions.getImage(url)
  if (image) {
    return image
  }

  const dbData = await get(url, db)

  if (dbData) {
    imageActions.saveImages([dbData])
    return dbData
  }
  const req = async () => {
    urlIsProcessing.add(url)
    const response = await fetch(
      `${env.VITE_IMGPROXY_URL}/unsafe/meta/0x0/${encodeURIComponent(url)}`,
    ).then((res) => res.json())

    const json = response.thumbor.source
    const record = {
      src: url,
      width: json.width,
      height: json.height,
      ratio: json.width / json.height,
    }

    imageActions.saveImages([record])
    set(url, record, db)
    // Error will not delete the url from the processing set
    urlIsProcessing.delete(url)

    return record
  }

  if (urlIsProcessing.has(url)) {
    return
  }

  return asyncQueue.add(req)
}
