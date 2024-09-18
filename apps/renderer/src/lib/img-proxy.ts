import { env } from "@follow/shared/env"
import { imageRefererMatches } from "@follow/shared/image"

export const getImageProxyUrl = ({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}) => `${env.VITE_IMGPROXY_URL}/unsafe/fit-in/${width}x${height}/${encodeURIComponent(url)}`

export const replaceImgUrlIfNeed = (url: string) => {
  for (const rule of imageRefererMatches) {
    if (rule.url.test(url)) {
      return getImageProxyUrl({ url, width: 0, height: 0 })
    }
  }
  return url
}
