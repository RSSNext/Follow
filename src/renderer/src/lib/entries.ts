import { useInfiniteQuery } from "@tanstack/react-query"
import { parseHtml } from "./parse-html"
import { levels } from "@renderer/lib/constants"

export const useEntries = ({
  level,
  id,
}: {
  level?: string
  id?: number | string
}) =>
  useInfiniteQuery({
    queryKey: ["entries", level, id],
    enabled: !!level && !!id,
    queryFn: async ({ pageParam }) => {
      let entries
      if (level === levels.folder) {
        entries = await (
          await fetch(
            `${import.meta.env.VITE_MINIFLUX_ENDPOINT}/v1/entries?` +
              new URLSearchParams({
                direction: "desc",
                limit: "20",
                after_entry_id: pageParam,
                category_id: id + "",
              }),
            {
              headers: {
                "X-Auth-Token": import.meta.env.VITE_MINIFLUX_TOKEN,
              },
            },
          )
        ).json()
      } else if (level === levels.type) {
        entries = await (
          await fetch(
            `${import.meta.env.VITE_MINIFLUX_ENDPOINT}/v1/entries?` +
              new URLSearchParams({
                direction: "desc",
                limit: "20",
                after_entry_id: pageParam,
              }),
            {
              headers: {
                "X-Auth-Token": import.meta.env.VITE_MINIFLUX_TOKEN,
              },
            },
          )
        ).json()
      }
      entries.entries = await Promise.all(
        entries.entries.map(async (entry) => {
          entry.content = entry.content.replaceAll(
            "https://pixiv.diygod.me/",
            "https://i.pximg.net/",
          )
          const parsed = await parseHtml(entry.content)
          return {
            ...entry,
            text: parsed.metadata?.desctription,
            images: parsed.metadata?.images,
          }
        }),
      )

      return entries
    },
    getNextPageParam: (lastPage) =>
      lastPage?.entries?.length
        ? lastPage.entries[lastPage.entries.length - 1].id
        : "",
    initialPageParam: "",
  })
