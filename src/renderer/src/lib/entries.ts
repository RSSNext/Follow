import { useInfiniteQuery } from '@tanstack/react-query'
import { parseHtml } from './parse-html'

export const useEntries = ({
  type,
  id,
}: {
  type?: string
  id?: number | string
}) =>
  useInfiniteQuery({
    queryKey: ['entries', type, id],
    enabled: !!type && !!id,
    queryFn: async ({ pageParam }) => {
      const entries = await (await fetch(`${import.meta.env.VITE_MINIFLUX_ENDPOINT}/v1/categories/${id}/entries?` + new URLSearchParams({
        direction: 'desc',
        limit: '20',
        after_entry_id: pageParam,
      }), {
        headers: {
          'X-Auth-Token': import.meta.env.VITE_MINIFLUX_TOKEN
        }
      })).json()
      entries.entries = await Promise.all(entries.entries.map(async (entry) => {
        entry.content = entry.content.replaceAll('https://pixiv.diygod.me/', 'https://i.pximg.net/');
        const parsed = await parseHtml(entry.content)
        return {
          ...entry,
          text: parsed.metadata?.desctription,
          images: parsed.metadata?.images,
        }
      }))

      return entries;
    },
    getNextPageParam: (lastPage) => lastPage?.entries?.length ? lastPage.entries[lastPage.entries.length - 1].id : '',
    initialPageParam: '',
  })
