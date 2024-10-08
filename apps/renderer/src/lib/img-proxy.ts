import { imageRefererMatches, webpCloudPublicServicesMatches } from "@follow/shared/image"

import { getAbValue, isAbEnabled } from "~/hooks/biz/useAb"

export const getImageProxyUrl = ({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}) => {
  const abValue = getAbValue("Image_Proxy_V2")
  if (isAbEnabled("Image_Proxy_V2")) {
    return `${abValue}?url=${encodeURIComponent(url)}&width=${width}&height=${height}`
  } else {
    return `${abValue}/unsafe/fit-in/${width}x${height}/${encodeURIComponent(url)}`
  }
}

export const replaceImgUrlIfNeed = (url?: string) => {
  if (!url) return url

  for (const rule of webpCloudPublicServicesMatches) {
    if (rule.url.test(url)) {
      return url.replace(rule.url, rule.target)
    }
  }

  for (const rule of imageRefererMatches) {
    if (rule.url.test(url)) {
      return getImageProxyUrl({ url, width: 0, height: 0 })
    }
  }
  return url
}
