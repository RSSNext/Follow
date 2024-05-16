import { useToast } from "@renderer/components/ui/use-toast"
import { useCallback } from "react"

export const useEntryActions = (url: string) => {
  const { toast } = useToast()

  const execAction = useCallback(
    (action: string) => {
      switch (action) {
        case "copyLink":
          navigator.clipboard.writeText(url)
          toast({
            duration: 1000,
            description: "Link copied to clipboard.",
          })
          break
        case "openInBrowser":
          window.open(url, "_blank")
          break
        case "share":
          window.electron.ipcRenderer.send("share-url", url)
          break
      }
    },
    [toast],
  )

  return { execAction }
}
