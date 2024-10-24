import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { memoize } from "lodash-es"
import { twMerge } from "tailwind-merge"
import { parse } from "tldts"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export { clsx } from "clsx"
export type OS = "macOS" | "iOS" | "Windows" | "Android" | "Linux" | ""

declare const window: {
  platform: NodeJS.Platform
  navigator: Navigator
}
declare const ELECTRON: boolean
export const getOS = memoize((): OS => {
  if (window.platform) {
    switch (window.platform) {
      case "darwin": {
        return "macOS"
      }
      case "win32": {
        return "Windows"
      }
      case "linux": {
        return "Linux"
      }
    }
  }

  const { userAgent } = window.navigator,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"]
  // @ts-expect-error
  const platform = window.navigator.userAgentData?.platform || window.navigator.platform
  let os = platform

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

export function detectBrowser() {
  const { userAgent } = navigator
  if (userAgent.includes("Edg")) {
    return "Microsoft Edge"
  } else if (userAgent.includes("Chrome")) {
    return "Chrome"
  } else if (userAgent.includes("Firefox")) {
    return "Firefox"
  } else if (userAgent.includes("Safari")) {
    return "Safari"
  } else if (userAgent.includes("Opera")) {
    return "Opera"
  } else if (userAgent.includes("Trident") || userAgent.includes("MSIE")) {
    return "Internet Explorer"
  }

  return "Unknown"
}

export const isSafari = memoize(() => {
  if (ELECTRON) return false
  const ua = window.navigator.userAgent
  return ua.includes("Safari") && !ua.includes("Chrome")
})

// eslint-disable-next-line no-control-regex
export const isASCII = (str) => /^[\u0000-\u007F]*$/.test(str)

const EPOCH = 1712546615000n // follow repo created
const MAX_TIMESTAMP_BITS = 41n // Maximum number of bits typically used for timestamp

export const isBizId = (id: string): boolean => {
  if (!id || !/^\d{13,19}$/.test(id)) return false

  const snowflake = BigInt(id)

  // Extract the timestamp assuming it's in the most significant bits after the sign bit
  const timestamp = (snowflake >> (63n - MAX_TIMESTAMP_BITS)) + EPOCH
  const date = new Date(Number(timestamp))

  // Check if the date is reasonable (between 2024 and 2050)
  if (date.getFullYear() >= 2024 && date.getFullYear() <= 2050) {
    // Additional validation: check if the ID is not larger than the maximum possible value
    const maxPossibleId = (1n << 63n) - 1n // Maximum possible 63-bit value
    if (snowflake <= maxPossibleId) {
      return true
    }
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

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const omitObjectUndefinedValue = (obj: Record<string, any>) => {
  const newObj = {}
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

export const sortByAlphabet = (a: string, b: string) => {
  const isALetter = /^[a-z]/i.test(a)
  const isBLetter = /^[a-z]/i.test(b)

  if (isALetter && !isBLetter) {
    return -1
  }
  if (!isALetter && isBLetter) {
    return 1
  }

  if (isALetter && isBLetter) {
    return a.localeCompare(b)
  }

  return a.localeCompare(b, "zh-CN")
}

export const isEmptyObject = (obj: Record<string, any>) => Object.keys(obj).length === 0

export const parseSafeUrl = (url: string) => {
  try {
    return new URL(url)
  } catch {
    return null
  }
}
export const getUrlIcon = (url: string, fallback?: boolean | undefined) => {
  let src: string
  let fallbackUrl = ""

  try {
    const { host } = new URL(url)
    const pureDomain = parse(host).domainWithoutSuffix
    fallbackUrl = `https://avatar.vercel.sh/${pureDomain}.svg?text=${pureDomain
      ?.slice(0, 2)
      .toUpperCase()}`
    src = `https://unavatar.webp.se/${host}?fallback=${fallback || false}`
  } catch {
    const pureDomain = parse(url).domainWithoutSuffix
    src = `https://avatar.vercel.sh/${pureDomain}.svg?text=${pureDomain?.slice(0, 2).toUpperCase()}`
  }
  const ret = {
    src,
    fallbackUrl,
  }

  return ret
}

export { parse as parseUrl } from "tldts"

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)
