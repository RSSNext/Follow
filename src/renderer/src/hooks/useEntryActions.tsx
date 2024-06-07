import { useToast } from "@renderer/components/ui/use-toast"
import { apiClient } from "@renderer/lib/api-fetch"
import { client } from "@renderer/lib/client"
import type { EntryModel } from "@renderer/models"
import { entryActions } from "@renderer/store/entry"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { FetchError } from "ofetch"
import { ofetch } from "ofetch"

export const useEntryActions = ({
  view,
  entry,
}: {
  view?: number
  entry?: EntryModel
}) => {
  const checkEagle = useQuery({
    queryKey: ["check-eagle"],
    enabled: !!entry?.entries.url && !!view,
    queryFn: async () => {
      try {
        await ofetch("http://localhost:41595")
        return true
      } catch (error: unknown) {
        return (error as FetchError).data?.code === 401
      }
    },
  })

  const collect = useMutation({
    mutationFn: async () =>
      entry && apiClient.collections.$post({
        json: {
          entryId: entry?.entries.id,
        },
      }),

    onMutate() {
      if (!entry) return
      entryActions.optimisticUpdate(entry.entries.id, {
        collections: {
          createdAt: new Date().toISOString(),
        },
      })
    },
    onSuccess: () => {
      toast({
        duration: 1000,
        description: "Collected.",
      })
    },
  })
  const uncollect = useMutation({
    mutationFn: async () =>
      entry && apiClient.collections.$delete({
        json: {
          entryId: entry?.entries.id,
        },
      }),

    onMutate() {
      if (!entry) return
      entryActions.optimisticUpdate(entry.entries.id, {
        collections: undefined,
      })
    },
    onSuccess: () => {
      toast({
        duration: 1000,
        description: "Uncollected.",
      })
    },
  })
  const read = useMutation({
    mutationFn: async () =>
      entry &&
      apiClient.reads.$post({
        json: {
          entryIds: [entry.entries.id],
        },
      }),

    onMutate: () => {
      if (!entry) return

      entryActions.markRead(entry.feeds.id, entry.entries.id, true)
    },
  })
  const unread = useMutation({
    mutationFn: async () => entry && apiClient.reads.$delete({
      json: {
        entryId: entry.entries.id,
      },
    }),

    onMutate: () => {
      if (!entry) return

      entryActions.markRead(entry.feeds.id, entry.entries.id, false)
    },
  })

  const { toast } = useToast()

  if (!entry?.entries.url || view === undefined) return { items: [] }

  const items = [
    [
      {
        name: "Star",
        className: "i-mingcute-star-line",
        disabled: !!entry.collections,
        onClick: () => {
          collect.mutate()
        },
      },
      {
        name: "Unstar",
        className: "i-mingcute-star-fill text-orange-500",
        disabled: !entry.collections,
        onClick: () => {
          uncollect.mutate()
        },
      },
      {
        name: "Copy Link",
        className: "i-mingcute-link-line",
        onClick: () => {
          if (!entry.entries.url) return
          navigator.clipboard.writeText(entry.entries.url)
          toast({
            duration: 1000,
            description: "Link copied to clipboard.",
          })
        },
      },
      {
        name: "Open in Browser",
        className: "i-mingcute-world-2-line",
        onClick: () => {
          if (!entry.entries.url) return
          window.open(entry.entries.url, "_blank")
        },
      },
      {
        name: "Save Images to Eagle",
        icon: "/eagle.svg",
        disabled:
          (checkEagle.isLoading ? true : !checkEagle.data) ||
          !entry.entries.images?.length,
        onClick: async () => {
          if (!entry.entries.url || !entry.entries.images?.length) return
          const response = await client?.saveToEagle({
            url: entry.entries.url,
            images: entry.entries.images,
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
        onClick: () => {
          if (!entry.entries.url) return
          client?.showShareMenu(entry.entries.url)
        },
      },
      {
        name: "Mark as Read",
        className: "i-mingcute-round-fill",
        disabled: !!entry.read,
        onClick: () => {
          read.mutate()
        },
      },
      {
        name: "Mark as Unread",
        className: "i-mingcute-round-line",
        disabled: !entry.read,
        onClick: () => {
          unread.mutate()
        },
      },
    ],
  ]

  return {
    items: items[view] || items[0],
  }
}
