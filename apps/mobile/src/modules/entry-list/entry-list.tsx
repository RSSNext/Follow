import { FeedViewType } from "@follow/constants"

import { EntryListContentGrid } from "@/src/modules/entry-list/entry-list-gird"
import { useSelectedView } from "@/src/modules/screen/atoms"
import { TimelineSelectorHeader } from "@/src/modules/screen/timeline-selector-header"

import { EntryListContentArticle } from "./entry-list-article"

export function EntryListScreen({ entryIds }: { entryIds: string[] }) {
  const view = useSelectedView()

  return (
    <TimelineSelectorHeader>
      {view === FeedViewType.Pictures || view === FeedViewType.Videos ? (
        <EntryListContentGrid entryIds={entryIds} />
      ) : (
        <EntryListContentArticle entryIds={entryIds} />
      )}
    </TimelineSelectorHeader>
  )
}
