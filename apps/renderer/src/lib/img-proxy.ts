import { imageRefererMatches } from "@follow/shared/image"

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
  if (isAbEnabled("Image_Proxy_V2")) {
    return `${getAbValue("Image_Proxy_V2")}?url=${encodeURIComponent(url)}&width=${width}&height=${height}`
  } else {
    return `${getAbValue("Image_Proxy_V2")}/unsafe/fit-in/${width}x${height}/${encodeURIComponent(url)}`
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
