import { initializeDefaultGeneralSettings } from "./general"
import { initializeDefaultUISettings } from "./ui"

export const initializeSettings = () => {
  initializeDefaultUISettings()
  initializeDefaultGeneralSettings()
}
