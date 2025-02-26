import { requireNativeModule } from "expo"

interface NativeModule {
  openLink: (url: string) => void
  previewImage: (images: string[]) => void
  scrollToTop: (reactTag: number) => void
}
const nativeModule = requireNativeModule("Helper") as NativeModule
export const openLink = (url: string) => {
  nativeModule.openLink(url)
}
export const quickLookImage = (images: string[]) => {
  nativeModule.previewImage(images)
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
