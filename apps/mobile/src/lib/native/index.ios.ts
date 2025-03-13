import { requireNativeModule } from "expo"
import { openURL } from "expo-linking"

import { getGeneralSettings } from "@/src/atoms/settings/general"

interface NativeModule {
  openLink: (url: string) => Promise<{
    type: "dismiss"
  }>
  previewImage: (images: string[]) => void
  scrollToTop: (reactTag: number) => void
}
const nativeModule = requireNativeModule("Helper") as NativeModule
export const openLink = (url: string, onDismiss?: () => void) => {
  const { openLinksInApp } = getGeneralSettings()
  if (!openLinksInApp) {
    openURL(url)
    return
  }
  nativeModule.openLink(url).then((res) => {
    if (res.type === "dismiss") {
      onDismiss?.()
    }
  })
}

export const performNativeScrollToTop = (reactTag: number) => {
  nativeModule.scrollToTop(reactTag)
}

export const showIntelligenceGlowEffect = () => {
  requireNativeModule("AppleIntelligenceGlowEffect").show()

  return hideIntelligenceGlowEffect
}

export const hideIntelligenceGlowEffect = () => {
  requireNativeModule("AppleIntelligenceGlowEffect").hide()
}
