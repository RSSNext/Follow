import { env } from "@follow/shared/env"
import { imageRefererMatches } from "@follow/shared/image"

import { getAbValue } from "~/hooks/biz/useAb"

export const getImageProxyUrl = ({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}) => {
  if (getAbValue("Image_Proxy_V2")) {
    return `${env.VITE_IMGPROXY_URL}?url=${encodeURIComponent(url)}&width=${width}&height=${height}`
  } else {
    return `${env.VITE_IMGPROXY_URL}/unsafe/fit-in/${width}x${height}/${encodeURIComponent(url)}`
  }
}

export const replaceImgUrlIfNeed = (url: string) => {
  for (const rule of imageRefererMatches) {
    if (rule.url.test(url)) {
      return getImageProxyUrl({ url, width: 0, height: 0 })
    }
  }
  return url
}
