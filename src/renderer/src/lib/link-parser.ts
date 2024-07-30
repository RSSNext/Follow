const GITHUB_HOST = "github.com"

export const isYoutubeUrl = (url: URL) =>
  url.hostname === "www.youtube.com" && url.pathname.startsWith("/watch")

export const isGithubUrl = (url: URL) => url.hostname === GITHUB_HOST

export const isTwitterUrl = (url: URL) => url.hostname === "twitter.com"
export const isXUrl = (url: URL) => url.hostname === "x.com"
