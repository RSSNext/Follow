import * as Linking from "expo-linking"
import { router } from "expo-router"
import { useEffect } from "react"

// This needs to stay outside of react to persist between account switches
let previousIntentUrl = ""

export function useIntentHandler() {
  const incomingUrl = Linking.useURL()

  useEffect(() => {
    if (incomingUrl) {
      if (previousIntentUrl === incomingUrl) return
      previousIntentUrl = incomingUrl
    }
    const id = extractFeedIdFromDeepLink(incomingUrl)
    if (!id) {
      console.warn("No feed id found in deep link:", incomingUrl)
      return
    }
    router.push(`/follow?id=${id}`)
  }, [incomingUrl])
}

// follow://add?id=1
const extractFeedIdFromDeepLink = (incomingUrl: string | null) => {
  if (!incomingUrl) return null

  const url = parseUrl(incomingUrl)
  if (!url) return null
  if (url.protocol !== "follow:" || url.host !== "add") return null

  const feedId = url.searchParams.get("id")

  if (!feedId) return null

  return feedId
}

const parseUrl = (url: string) => {
  try {
    return new URL(url)
  } catch {
    return null
  }
}
