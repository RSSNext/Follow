import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { FEED_COLLECTION_LIST, levels } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(value, min, max) {
  return Math.max(Math.min(max, value), min)
}

export function getEntriesParams({
  level,
  id,
  view,
}: {
  level?: string
  id?: number | string
  view?: number
}) {
  const params: {
    feedId?: string
    feedIdList?: string[]
    collected?: boolean
  } = {}
  if (level === levels.folder) {
    if (id === FEED_COLLECTION_LIST) {
      params.collected = true
    } else {
      params.feedIdList = `${id}`.split(",")
    }
  } else if (level === levels.feed) {
    params.feedId = `${id}`
  }
  return {
    view,
    ...params,
  }
}

export function getOS() {
  const { userAgent } = window.navigator,
    { platform } = window.navigator,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"]
  let os = ""

  if (macosPlatforms.includes(platform)) {
    os = "macOS"
  } else if (iosPlatforms.includes(platform)) {
    os = "iOS"
  } else if (windowsPlatforms.includes(platform)) {
    os = "Windows"
  } else if (/Android/.test(userAgent)) {
    os = "Android"
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux"
  }

  return os
}
