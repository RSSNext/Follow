import { useToast } from "@renderer/components/ui/use-toast"
import { useUpdateEntry } from "@renderer/hooks/useUpdateEntry"
import { client } from "@renderer/lib/client"
import type { EntriesResponse } from "@renderer/lib/types"
import { apiFetch } from "@renderer/queries/api-fetch"
import {
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import type { FetchError } from "ofetch"
import { ofetch } from "ofetch"

export const useEntryActions = ({
  view,
  entry,
}: {
  view?: number
  entry?: EntriesResponse[number]
}) => {
  const checkEagle = useQuery({
    queryKey: ["check-eagle"],
    enabled: !!entry?.url && !!view,
    queryFn: async () => {
      try {
        await ofetch("http://localhost:41595")
        return true
      } catch (error: unknown) {
        return (error as FetchError).data?.code === 401
      }
    },
  })

  const updateEntry = useUpdateEntry({
    entryId: entry?.id,
  })

  const collect = useMutation({
    mutationFn: async () =>
      apiFetch("/collections", {
        method: "POST",
        body: {
          entryId: entry?.id,
        },
      }),
    onSuccess: () => {
      updateEntry({
        collected: true,
      })

      toast({
        duration: 1000,
        description: "Collected.",
      })
    },
  })
  const uncollect = useMutation({
    mutationFn: async () =>
      apiFetch("/collections", {
        method: "DELETE",
        body: {
          entryId: entry?.id,
        },
      }),
    onSuccess: () => {
      updateEntry({
        collected: false,
      })

      toast({
        duration: 1000,
        description: "Uncollected.",
      })
    },
  })

  const { toast } = useToast()

  if (!entry?.url || view === undefined) return { items: [] }

  const items = [
    [
      {
        name: "Collect",
        className: "i-mingcute-star-line",
        action: "collect",
        disabled: !!entry.collected,
        onClick: () => {
          collect.mutate()
        },
      },
      {
        name: "Uncollect",
        className: "i-mingcute-star-fill",
        action: "uncollect",
        disabled: !entry.collected,
        onClick: () => {
          uncollect.mutate()
        },
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
          const response = await client?.saveToEagle({
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
          client?.showShareMenu(entry.url)
        },
      },
    ],
  ]

  return {
    items: items[view] || items[0],
  }
}
