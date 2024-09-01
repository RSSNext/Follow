import {
  isGCoreUrl,
  isGithubUrl,
  isPixivUrl,
  isTwitterUrl,
  isV2exUrl,
  isXUrl,
  isYoutubeUrl,
} from "@renderer/lib/link-parser"

export const getSupportedPlatformIconName = (url: string) => {
  const safeUrl = parseSafeUrl(url)

  if (!safeUrl) {
    return false
  }
  switch (true) {
    case isGithubUrl(safeUrl): {
      return "github"
    }
    case isTwitterUrl(safeUrl): {
      return "twitter"
    }
    case isXUrl(safeUrl): {
      return "x"
    }
    case isYoutubeUrl(safeUrl): {
      return "youtube"
    }
    case isGCoreUrl(safeUrl): {
      return "gcore"
    }
    case isV2exUrl(safeUrl): {
      return "v2ex"
    }
    case isPixivUrl(safeUrl): {
      return "pixiv"
    }
  }

  return false
}

const parseSafeUrl = (url: string) => {
  try {
    return new URL(url)
  } catch {
    return null
  }
}
