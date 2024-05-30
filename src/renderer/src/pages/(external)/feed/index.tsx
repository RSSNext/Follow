import { FeedIcon } from "@renderer/components/feed-icon"
import { levels } from "@renderer/lib/constants"
import { useEntries } from "@renderer/queries/entries"
import { useFeed } from "@renderer/queries/feed"
import { useParams } from "react-router-dom"

export function Component() {
  const { id } = useParams()
  const feed = useFeed({
    id,
  })
  const entries = useEntries({
    id,
    level: levels.feed,
  })

  return (
    <>
      {feed.data?.feed && (
        <div className="flex flex-col items-center">
          <FeedIcon
            feed={feed.data.feed}
            className="mr-2 size-8 shrink-0"
          />
          <h1>{feed.data.feed.title}</h1>
          {entries.data?.pages.map((page) =>
            page.data?.map((entry) => (
              <div key={entry.entries.id}>
                <h2>{entry.entries.title}</h2>
              </div>
            )),
          )}
        </div>
      )}
    </>
  )
}
