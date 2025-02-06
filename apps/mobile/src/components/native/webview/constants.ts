import { Platform } from "react-native"

export const htmlUrl = Platform.select({
  ios: "file://rn-web/html-renderer/index.html",
  default: "",
})
