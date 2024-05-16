import { useToast } from "@renderer/components/ui/use-toast"
import { useCallback } from "react"
import { ofetch } from "ofetch"
import { useQuery } from "@tanstack/react-query"

export const useCheckEagle = () =>
  useQuery({
    queryKey: ["check-eagle"],
    queryFn: async () => {
      try {
        await ofetch("http://localhost:41595")
        return true
      } catch (error: any) {
        return error.data?.code === 401
      }
    },
  })

export const useEntryActions = ({
  url,
  images,
}: {
  url: string
  images?: string[]
}) => {
  const checkEagle = useCheckEagle()

  const items = [
    [
      {
        name: "Copy Link",
        className: "i-mingcute-link-line",
        action: "copyLink",
      },
      {
        name: "Open in Browser",
        className: "i-mingcute-world-2-line",
        action: "openInBrowser",
      },
      {
        name: "Save Images to Eagle",
        icon: "/eagle.svg",
        action: "save-to-eagle",
        disabled:
          (checkEagle.isLoading ? true : !checkEagle.data) || !images?.length,
      },
      {
        name: "Share",
        className: "i-mingcute-share-2-line",
        action: "share",
      },
    ],
  ]

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

  return {
    execAction,
    items,
  }
}
