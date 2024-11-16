import path from "node:path"
import { fileURLToPath } from "node:url"

import { isMacOS } from "./env"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const iconMap = {
  prod: path.join(__dirname, "../../resources/icon.png"),
  dev: path.join(__dirname, "../../static/icon-dev.png"),
}
export const getIconPath = () => iconMap[process.env.NODE_ENV === "development" ? "dev" : "prod"]
export const getTrayIconPath = () =>
  isMacOS ? path.join(__dirname, "../../resources/tray-icon.png") : getIconPath()
