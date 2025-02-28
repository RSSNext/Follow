const imageRefererMatches = [
  {
    url: /^https:\/\/\w+\.sinaimg.cn/,
    referer: "https://weibo.com",
  },
  {
    url: /^https:\/\/i\.pximg\.net/,
    referer: "https://www.pixiv.net",
  },
  {
    url: /^https:\/\/cdnfile\.sspai\.com/,
    referer: "https://sspai.com",
  },
  {
    url: /^https:\/\/(?:\w|-)+\.cdninstagram\.com/,
    referer: "https://www.instagram.com",
  },
  {
    url: /^https:\/\/sp1\.piokok\.com/,
    referer: "https://www.piokok.com",
    force: true,
  },
]

const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const getImageHeaders = (url: string | undefined) => {
  if (!url || !isValidUrl(url)) return {}

  const ua =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"

  const refererMatch = imageRefererMatches.find((item) => item.url.test(url))
  if (refererMatch?.referer) {
    return {
      Referer: refererMatch.referer,
      "User-Agent": ua,
    }
  } else {
    return {
      Referer: new URL(url).origin,
      "User-Agent": ua,
    }
  }
}
