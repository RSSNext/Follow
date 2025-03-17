import analytics from "@react-native-firebase/analytics"
import { useEffect } from "react"

import { Navigation } from "./lib/navigation/Navigation"

export const Analytics = () => {
  useEffect(() => {
    return Navigation.rootNavigation.on("didAppear", ({ screenId }) => {
      const logScreenView = async () => {
        try {
          await analytics().logScreenView({
            screen_name: screenId,
            screen_class: screenId,
          })
        } catch (err: any) {
          console.warn(`[Error] logScreenView: ${err}`)
        }
      }
      logScreenView()
    })
  }, [])
  return null
}
