import * as WebBrowser from "expo-web-browser"
import { useCallback } from "react"

// Ported from https://github.com/bluesky-social/social-app/blob/0c71f8196faf401dc9847b0bfb6559e5d7024940/src/lib/hooks/useOpenLink.ts
// License: MIT
export function useOpenLink() {
  const openLink = useCallback(async (url: string) => {
    WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      // toolbarColor: theme.atoms.bg.backgroundColor,
      // controlsColor: theme.palette.primary_500,
      createTask: false,
    })
  }, [])

  return openLink
}
