import { FeedViewType } from "@follow/constants"

import { EntryListContentGrid } from "@/src/modules/entry-list/entry-list-gird"
import { useSelectedView } from "@/src/modules/screen/atoms"

import { TimelineSelectorHeader } from "../screen/TimelineSelectorHeader"
import { EntryListContentArticle } from "./entry-list-article"
import { EntryListContentSocial } from "./entry-list-social"

export function EntryListScreen({ entryIds }: { entryIds: string[] }) {
  const view = useSelectedView()

  let ContentComponent = EntryListContentArticle
  switch (view) {
    case FeedViewType.SocialMedia: {
      ContentComponent = EntryListContentSocial
      break
    }
    case FeedViewType.Pictures:
    case FeedViewType.Videos: {
      ContentComponent = EntryListContentGrid
      break
    }
    case FeedViewType.Articles: {
      ContentComponent = EntryListContentArticle
      break
    }
  }

  return (
    <TimelineSelectorHeader>
      <ContentComponent entryIds={entryIds} />
    </TimelineSelectorHeader>
  )
}
