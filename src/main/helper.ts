import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const iconMap = {
  prod: path.join(__dirname, "../../resources/icon.png"),
  dev: path.join(__dirname, "../../resources/icon-dev.png"),
}
export const getIconPath = () => iconMap[process.env.NODE_ENV === "development" ? "dev" : "prod"]
