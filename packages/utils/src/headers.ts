import { imageRefererMatches } from "./img-proxy"

export const createBuildSafeHeaders =
  (webUrl: string, selfRefererMatches: string[]) =>
  ({ url, headers = {} }: { url: string; headers?: Record<string, string> }) => {
    // user agent
    if (headers["User-Agent"]) {
      headers["User-Agent"] = headers["User-Agent"]
        .replace(/\s?Electron\/[\d.]+/, "")
        .replace(/\s?Follow\/[\d.a-zA-Z-]+/, "")
    } else {
      headers["User-Agent"] =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
    }

    // referer and origin
    if (selfRefererMatches.some((item) => url.startsWith(item))) {
      headers.Referer = webUrl
    } else {
      const refererMatch = imageRefererMatches.find((item) => item.url.test(url))
      const referer = refererMatch?.referer
      if (referer) {
        headers.Referer = referer
        headers.Origin = referer
      } else {
        try {
          const urlObj = new URL(url)
          headers.Referer = urlObj.origin
          headers.Origin = urlObj.origin
        } catch (error) {
          console.error(error)
        }
      }
    }

    return headers
  }
