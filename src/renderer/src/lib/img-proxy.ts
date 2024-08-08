import { env } from "@env"
import { imageActions } from "@renderer/store/image"
import { imageRefererMatches } from "@shared/image"

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

export const fetchImageDimensions = (url: string) =>
  new Promise<{ width: number, height: number, ratio: number }>(
    (resolve, reject) => {
      const image = imageActions.getImage(url)
      if (image) {
        return resolve(image)
      }

      fetch(
        `${env.VITE_IMGPROXY_URL}/unsafe/meta/0x0/${encodeURIComponent(url)}`,
      )
        .then((res) => res.json())
        .then(({ thumbor: { source: json } }) => {
          resolve({
            width: json.width,
            height: json.height,
            ratio: json.width / json.height,
          })

          imageActions.saveImages([
            {
              src: url,
              width: json.width,
              height: json.height,
              ratio: json.width / json.height,
            },
          ])
        })
        .catch(reject)
    },
  )
