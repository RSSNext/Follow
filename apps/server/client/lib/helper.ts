import { setOpenInAppDeeplink } from "@client/atoms/app"
import type { FeedOrListRespModel } from "@follow/models/types"
import { DEEPLINK_SCHEME } from "@follow/shared/constants"

export const getPreferredTitle = (feed?: FeedOrListRespModel | null) => {
  if (!feed?.id) {
    return feed?.title
  }

  return feed.title
}

export const getHydrateData = (key: string) => {
  return window.__HYDRATE__?.[key]
}

export const askOpenInFollowApp = (deeplink: string, fallback?: () => string): Promise<boolean> => {
  return new Promise(() => {
    const deeplinkUrl = `${DEEPLINK_SCHEME}${deeplink}`
    setOpenInAppDeeplink({
      deeplink: deeplinkUrl,
      fallbackUrl: fallback ? fallback() : undefined,
    })
  })
}

export const openInFollowApp = ({
  deeplink,
  fallback,
  alwaysFallback,
  fallbackUrl,
}: {
  deeplink: string
  fallback: () => void
  alwaysFallback?: boolean
  fallbackUrl?: string
}): Promise<boolean> => {
  return new Promise((resolve) => {
    const timeout = 500
    let isAppOpened = false

    const handleBlur = () => {
      isAppOpened = true
      cleanup()
      resolve(true)
    }

    const cleanup = () => {
      window.removeEventListener("blur", handleBlur)
    }

    window.addEventListener("blur", handleBlur)

    const deeplinkUrl = `${DEEPLINK_SCHEME}${deeplink}`
    console.info("Open deeplink:", deeplinkUrl)
    window.location.href = deeplinkUrl

    setTimeout(() => {
      cleanup()
      if (!isAppOpened && !alwaysFallback) {
        fallback()
        resolve(false)
        return
      }
      setOpenInAppDeeplink({
        deeplink: deeplinkUrl,
        fallbackUrl,
      })
    }, timeout)
  })
}
