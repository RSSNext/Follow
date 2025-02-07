import { openURL } from "expo-linking"

export const openLink = (url: string) => {
  openURL(url)
}

export const quickLookImage = (_images: string[]) => {}
