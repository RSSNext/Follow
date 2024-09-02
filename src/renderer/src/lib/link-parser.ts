const GITHUB_HOST = "github.com"

export const isYoutubeUrl = (url: URL) =>
  url.hostname === "www.youtube.com" && url.pathname.startsWith("/watch")

export const isGithubUrl = (url: URL) => url.hostname === GITHUB_HOST || url.hostname === "github.blog"

export const isTwitterUrl = (url: URL) => url.hostname === "twitter.com"
export const isXUrl = (url: URL) => url.hostname === "x.com"

export const isGCoreUrl = (url: URL) => url.hostname.includes("gcores.com")
export const isV2exUrl = (url: URL) => url.hostname.includes("v2ex.com")
export const isPixivUrl = (url: URL) => url.hostname.includes("pixiv.net")
