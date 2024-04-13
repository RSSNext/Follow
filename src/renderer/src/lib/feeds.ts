import { useQuery } from '@tanstack/react-query'

export const useFeeds = () =>
  useQuery({
    queryKey: ['feeds'],
    queryFn: async () => {
      const feeds = await (await fetch(`${import.meta.env.VITE_MINIFLUX_ENDPOINT}/v1/feeds`, {
        headers: {
          'X-Auth-Token': import.meta.env.VITE_MINIFLUX_TOKEN
        }
      })).json()
      const counters = await (await fetch(`${import.meta.env.VITE_MINIFLUX_ENDPOINT}/v1/feeds/counters`, {
        headers: {
          'X-Auth-Token': import.meta.env.VITE_MINIFLUX_TOKEN
        }
      })).json()

      const categories = {
        list: {},
        unread: 0,
      }
      feeds?.forEach((feed) => {
        if (!categories.list[feed.category.title]) {
          categories.list[feed.category.title] = {
            list: [],
            unread: 0
          }
        }
        const unread = counters.unreads[feed.id] || 0
        feed.unread = unread
        categories.list[feed.category.title].list.push(feed)
        categories.list[feed.category.title].unread += unread
        categories.unread += unread
      })
      const list = Object.entries(categories.list).map(([name, list]: any) => ({
        name,
        list: list.list.sort((a, b) => b.unread - a.unread),
        unread: list.unread
      })).sort((a, b) => b.unread - a.unread)
      return {
        list,
        unread: categories.unread
      }
    }
  })
