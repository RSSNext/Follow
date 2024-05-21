import { useToast } from "@renderer/components/ui/use-toast"
import { useCallback } from "react"
import { ofetch } from "ofetch"
import { useQuery } from "@tanstack/react-query"
import { client } from "@renderer/lib/client"
import { EntriesResponse } from "@renderer/lib/types"

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
  view,
  entry,
}: {
  view: number
  entry: EntriesResponse[number]
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
          (checkEagle.isLoading ? true : !checkEagle.data) ||
          !entry.images?.length,
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
    async (action: string) => {
      switch (action) {
        case "copyLink":
          if (!entry.url) return
          navigator.clipboard.writeText(entry.url)
          toast({
            duration: 1000,
            description: "Link copied to clipboard.",
          })
          break
        case "openInBrowser":
          if (!entry.url) return
          window.open(entry.url, "_blank")
          break
        case "share":
          if (!entry.url) return
          client.showShareMenu(entry.url)
          break
        case "save-to-eagle":
          if (!entry.url || !entry.images?.length) return
          const response = await client.saveToEagle({
            url: entry.url,
            images: entry.images,
          })
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
          break
      }
    },
    [toast],
  )

  return {
    execAction,
    items: items[view] || items[0],
  }
}
