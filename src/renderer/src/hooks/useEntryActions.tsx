import { useToast } from "@renderer/components/ui/use-toast"
import { ofetch, type FetchError } from "ofetch"
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query"
import { client } from "@renderer/lib/client"
import { EntriesResponse, ListResponse } from "@renderer/lib/types"
import { apiFetch } from "@renderer/lib/queries/api-fetch"

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
      } catch (error: unknown) {
        return (error as FetchError).data?.code === 401
      }
    },
  })

  const queryClient = useQueryClient()

  const updateCollection = (
    target: {
      createdAt: string
    } | null,
  ) => {
    const key = ["entry", entry.id]
    const data = queryClient.getQueryData(key)
    if (data) {
      queryClient.setQueryData(
        key,
        Object.assign({}, data, {
          collections: target,
        }),
      )
    }

    const entriesData = queryClient.getQueriesData({
      queryKey: ["entries"],
    })
    entriesData.forEach(
      ([key, data]: [
        QueryKey,
        InfiniteData<ListResponse<EntriesResponse>>,
      ]) => {
        const list = data?.pages?.[0]?.data
        list?.forEach((item) => {
          if (item.id === entry.id) {
            item.collections = target
            queryClient.setQueryData(key, data)
          }
        })
      },
    )
  }

  const collect = useMutation({
    mutationFn: async () =>
      apiFetch("/collections", {
        method: "POST",
        body: {
          entryId: entry.id,
        },
      }),
    onSuccess: () => {
      updateCollection({
        createdAt: new Date().toISOString(),
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
          entryId: entry.id,
        },
      }),
    onSuccess: () => {
      updateCollection(null)

      toast({
        duration: 1000,
        description: "Uncollected.",
      })
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
        onClick: () => {
          collect.mutate()
        },
      },
      {
        name: "Uncollect",
        className: "i-mingcute-star-fill",
        action: "uncollect",
        disabled: !entry.collections,
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
