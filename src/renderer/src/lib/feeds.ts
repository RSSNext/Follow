import { useQuery } from '@tanstack/react-query'

export const useFeeds = () =>
  useQuery({
    queryKey: ['feeds'],
    queryFn: async () => {
      return (await fetch(`${import.meta.env.VITE_MINIFLUX_ENDPOINT}/v1/feeds`, {
        headers: {
          'X-Auth-Token': import.meta.env.VITE_MINIFLUX_TOKEN
        }
      })).json()
    }
  })
