import {
  IMAGE_PROXY_URL,
  imageRefererMatches,
  webpCloudPublicServicesMatches,
} from "@follow/shared/image"

export const getImageProxyUrl = ({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}) => {
  return `${IMAGE_PROXY_URL}?url=${encodeURIComponent(url)}&width=${width}&height=${height}`
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
