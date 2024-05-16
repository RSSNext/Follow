import { useToast } from "@renderer/components/ui/use-toast"
import { useCallback } from "react"

export const useEntryActions = ({
  url,
  images,
}: {
  url: string
  images?: string[]
}) => {
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
        case "save-to-eagle":
          window.electron.ipcRenderer.once(
            "save-to-eagle-reply",
            (_, response) => {
              if (response?.status === "success") {
                toast({
                  duration: 3000,
                  description: "Saved to Eagle.",
                })
              } else {
                toast({
                  duration: 3000,
                  description: "Failed to save to Eagle.",
                })
              }
            },
          )
          window.electron.ipcRenderer.send("save-to-eagle", {
            url,
            images,
          })
          break
      }
    },
    [toast],
  )

  return { execAction }
}
