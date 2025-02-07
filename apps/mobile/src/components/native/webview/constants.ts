import { Image, Platform } from "react-native"

const assetPath = Image.resolveAssetSource({
  uri: "rn-web/html-renderer",
}).uri
export const htmlUrl = Platform.select({
  ios: `file://${assetPath}/index.html`,
  default: "",
})
