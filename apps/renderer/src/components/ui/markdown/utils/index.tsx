import { useMemo } from "react"

import { useFeedByIdSelector } from "~/store/feed"

import { TimeStamp } from "../components/TimeStamp"

export const ensureAndRenderTimeStamp = (children: string) => {
  const firstPart = children.replace(" ", " ").split(" ")[0]
  // 00:00 , 00:00:00
  if (!firstPart) {
    return
  }
  const isTime = isValidTimeString(firstPart.trim())
  if (isTime) {
    return (
      <>
        <TimeStamp time={firstPart} />
        <span>{children.slice(firstPart.length)}</span>
      </>
    )
  }
  return false
}
function isValidTimeString(time: string): boolean {
  const timeRegex = /^\d{1,2}:[0-5]\d(?::[0-5]\d)?$/
  return timeRegex.test(time)
}

export function timeStringToSeconds(time: string): number | null {
  const timeParts = time.split(":").map(Number)

  if (timeParts.length === 2) {
    const [minutes, seconds] = timeParts
    return minutes * 60 + seconds
  } else if (timeParts.length === 3) {
    const [hours, minutes, seconds] = timeParts
    return hours * 3600 + minutes * 60 + seconds
  } else {
    return null
  }
}

const safeUrl = (url: string, baseUrl: string) => {
  try {
    return new URL(url, baseUrl).href
  } catch {
    return url
  }
}
export const usePopulatedFullUrl = (feedId: string, relativeUrl?: string) => {
  const feedSiteUrl = useFeedByIdSelector(feedId, (feed) =>
    "siteUrl" in feed ? feed.siteUrl : undefined,
  )

  const populatedFullHref = useMemo(() => {
    if (!relativeUrl) return void 0

    if (relativeUrl.startsWith("http")) return relativeUrl
    if (relativeUrl.startsWith("/") && feedSiteUrl) return safeUrl(relativeUrl, feedSiteUrl)
    return relativeUrl
  }, [feedSiteUrl, relativeUrl])

  return populatedFullHref
}
