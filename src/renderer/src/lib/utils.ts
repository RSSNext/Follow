import type { RSSHubRoute } from "@renderer/modules/discover/types"
import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { memoize } from "lodash-es"
import { twMerge } from "tailwind-merge"

import { FEED_COLLECTION_LIST, ROUTE_FEED_PENDING } from "../constants/app"
import { FeedViewType } from "./enum"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(value, min, max) {
  return Math.max(Math.min(max, value), min)
}

export function getEntriesParams({
  id,
  view,
}: {
  id?: number | string
  view?: number
}) {
  const params: {
    feedId?: string
    feedIdList?: string[]
    collected?: boolean
  } = {}
  if (id === FEED_COLLECTION_LIST) {
    params.collected = true
  } else if (id && id !== ROUTE_FEED_PENDING) {
    params.feedIdList = `${id}`.split(",")
  }
  return {
    view,
    ...params,
  }
}

export type OS = "macOS" | "iOS" | "Windows" | "Android" | "Linux" | ""
export const getOS = memoize((): OS => {
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

  return os as OS
})

// eslint-disable-next-line no-control-regex
export const isASCII = (str) => /^[\u0000-\u007F]*$/.test(str)

export const isBizId = (id) => {
  if (!id) return false

  // id is uuid or snowflake

  // 0. check is uuid
  if (
    id.length === 36 &&
    id[8] === "-" &&
    id[13] === "-" &&
    id[18] === "-" &&
    id[23] === "-"
  ) {
    return true
  }

  // 1. check is snowflake
  // snowflake ep 1712546615000
  if (id.length > 16 && id.length < 20 && !Number.isNaN(id)) {
    return true
  }

  return false
}

export function formatXml(xml: string, indent = 4) {
  const PADDING = " ".repeat(indent)
  let formatted = ""
  const regex = /(>)(<)(\/*)/g
  xml = xml.replaceAll(regex, "$1\r\n$2$3")
  let pad = 0
  xml.split("\r\n").forEach((node) => {
    let indent = 0
    if (/.+<\/\w[^>]*>$/.test(node)) {
      indent = 0
    } else if (/^<\/\w/.test(node) && pad !== 0) {
      pad -= 1
    } else if (/^<\w(?:[^>]*[^/])?>.*$/.test(node)) {
      indent = 1
    } else {
      indent = 0
    }

    formatted += `${PADDING.repeat(pad) + node}\r\n`
    pad += indent
  })

  return formatted.trim()
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const pluralize = (
  noun: string,
  count: number,
  postfix: string | ((noun: string, rule: Intl.LDMLPluralRule) => string) = "s",
) => {
  let rule: Intl.LDMLPluralRule
  // Check Support
  if (typeof Intl === "undefined" || !Intl.PluralRules) {
    if (count === 1) {
      rule = "one"
    } else {
      rule = "other"
    }
  }
  rule = new Intl.PluralRules("en", { type: "ordinal" }).select(count)

  if (typeof postfix === "string") {
    return `${noun}${count === 1 ? "" : postfix}`
  }
  return postfix(noun, rule)
}

export const omitObjectUndefinedValue = (obj: Record<string, any>) => {
  const newObj = {}
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

const rsshubCategoryMap: Partial<Record<string, FeedViewType>> = {
  "design": FeedViewType.Pictures,
  "forecast": FeedViewType.Notifications,
  "live": FeedViewType.Notifications,
  "picture": FeedViewType.Pictures,
  "program-update": FeedViewType.Notifications,
  "social-media": FeedViewType.SocialMedia,
}

export const getViewFromRoute = (route: RSSHubRoute) => {
  if (route.view) {
    return route.view
  }
  for (const categories of route.categories) {
    if (rsshubCategoryMap[categories]) {
      return rsshubCategoryMap[categories]
    }
  }
  return null
}
