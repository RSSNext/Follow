export const imageRefererMatches = [
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
]

export const webpCloudPublicServicesMatches = [
  // https://docs.webp.se/public-services/github-avatar/
  {
    url: /^https:\/\/avatars\.githubusercontent\.com\/u\//,
    referer: "https://avatars-githubusercontent.webp.se/u/",
  },
]
