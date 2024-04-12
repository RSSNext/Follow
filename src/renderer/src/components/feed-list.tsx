import { useFeeds } from '@renderer/lib/feeds'

export function FeedList({ type }: { type: string }) {
  const feeds = useFeeds()
  console.log('feeds', feeds.data)

  return (
    <div className="w-80 px-4">
      <div>{type}</div>
    </div>
  )
}
