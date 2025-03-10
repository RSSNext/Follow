import * as Linking from "expo-linking"
import { router } from "expo-router"
import { useEffect } from "react"

// This needs to stay outside of react to persist between account switches
let previousIntentUrl = ""
export const resetIntentUrl = () => {
  previousIntentUrl = ""
}

export function useIntentHandler() {
  const incomingUrl = Linking.useURL()

  useEffect(() => {
    if (incomingUrl) {
      if (previousIntentUrl === incomingUrl) return
      previousIntentUrl = incomingUrl
    }

    const searchParams = extractParamsFromDeepLink(incomingUrl)
    if (!searchParams) {
      console.warn("No valid params found in deep link:", incomingUrl)
      return
    }

    router.push(`/follow?${searchParams.toString()}`)
  })
}

// follow://add?id=41147805276726272
// follow://add?type=list&id=60580187699502080
// follow://add?type=url&url=rsshub://rsshub/routes/en
const extractParamsFromDeepLink = (incomingUrl: string | null): URLSearchParams | null => {
  if (!incomingUrl) return null

  try {
    const url = new URL(incomingUrl)
    if (url.protocol !== "follow:" || url.hostname !== "add") return null

    const { searchParams } = url

    // If no valid parameters were found (neither id nor url)
    if (!searchParams.has("id") && !searchParams.has("url")) return null

    return searchParams
  } catch {
    return null
  }
}
