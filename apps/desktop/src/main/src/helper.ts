import path from "node:path"
import { fileURLToPath } from "node:url"

import { isMacOS, isWindows } from "./env"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const iconMap = {
  prod: path.join(__dirname, "../../resources/icon.png"),
  dev: path.join(__dirname, "../../static/icon-dev.png"),
}
export const getIconPath = () => iconMap[process.env.NODE_ENV === "development" ? "dev" : "prod"]
export const getTrayIconPath = () => {
  if (isMacOS) {
    return path.join(__dirname, "../../resources/tray-icon.png")
  }
  if (isWindows) {
    // https://www.electronjs.org/docs/latest/api/tray#:~:text=Windows,best%20visual%20effects.
    return path.join(__dirname, "../../resources/icon-no-padding.ico")
  }
  return getIconPath()
}
