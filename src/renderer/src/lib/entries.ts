import { useInfiniteQuery } from '@tanstack/react-query'

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

      return entries;
    },
    getNextPageParam: (lastPage) => lastPage?.entries?.length ? lastPage.entries[lastPage.entries.length - 1].id : '',
    initialPageParam: '',
  })
