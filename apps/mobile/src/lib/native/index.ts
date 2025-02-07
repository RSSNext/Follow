import { openURL } from "expo-linking"

export const openLink = (url: string) => {
  openURL(url)
}
