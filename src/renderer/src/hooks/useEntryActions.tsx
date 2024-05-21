import { useToast } from "@renderer/components/ui/use-toast"
import { useCallback } from "react"
import { ofetch } from "ofetch"
import { useQuery } from "@tanstack/react-query"
import { client } from "@renderer/lib/client"
import { EntriesResponse } from "@renderer/lib/types"

export const useEntryActions = ({
  view,
  entry,
}: {
  view: number
  entry: EntriesResponse[number]
}) => {
  const checkEagle = useQuery({
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

  const { toast } = useToast()

  const items = [
    [
      {
        name: "Collect",
        className: "i-mingcute-star-line",
        action: "collect",
        disabled: !!entry.collections,
        onClick: () => {},
      },
      {
        name: "Uncollect",
        className: "i-mingcute-star-fill",
        action: "uncollect",
        disabled: !entry.collections,
        onClick: () => {},
      },
      {
        name: "Copy Link",
        className: "i-mingcute-link-line",
        action: "copyLink",
        onClick: () => {
          if (!entry.url) return
          navigator.clipboard.writeText(entry.url)
          toast({
            duration: 1000,
            description: "Link copied to clipboard.",
          })
        },
      },
      {
        name: "Open in Browser",
        className: "i-mingcute-world-2-line",
        action: "openInBrowser",
        onClick: () => {
          if (!entry.url) return
          window.open(entry.url, "_blank")
        },
      },
      {
        name: "Save Images to Eagle",
        icon: "/eagle.svg",
        action: "save-to-eagle",
        disabled:
          (checkEagle.isLoading ? true : !checkEagle.data) ||
          !entry.images?.length,
        onClick: async () => {
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
        },
      },
      {
        name: "Share",
        className: "i-mingcute-share-2-line",
        action: "share",
        onClick: () => {
          if (!entry.url) return
          client.showShareMenu(entry.url)
        },
      },
    ],
  ]

  return {
    items: items[view] || items[0],
  }
}
