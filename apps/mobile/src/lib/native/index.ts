import { openURL } from "expo-linking"

export const openLink = (url: string) => {
  openURL(url)
}

export const quickLookImage = (_images: string[]) => {}

export const performNativeScrollToTop = (_reactTag: number) => {
  throw new Error("performNativeScrollToTop is not supported on this platform")
}

export const showIntelligenceGlowEffect = () => {
  return hideIntelligenceGlowEffect
}

export const hideIntelligenceGlowEffect = () => {}
