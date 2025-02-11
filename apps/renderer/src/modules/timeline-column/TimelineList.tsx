import type { FeedViewType } from "@follow/constants"

import {
  ROUTE_TIMELINE_OF_INBOX,
  ROUTE_TIMELINE_OF_LIST,
  ROUTE_TIMELINE_OF_VIEW,
} from "~/constants"

import { FeedList } from "./FeedList"
import { InboxList } from "./InboxList"
import { ListFeedList } from "./ListFeedList"

export default function TimelineList({ timelineId }: { timelineId: string }) {
  if (timelineId.startsWith(ROUTE_TIMELINE_OF_VIEW)) {
    const id = Number.parseInt(timelineId.slice(ROUTE_TIMELINE_OF_VIEW.length), 10) as FeedViewType
    return <FeedList className="flex size-full flex-col text-sm" view={id} />
  } else if (timelineId.startsWith(ROUTE_TIMELINE_OF_LIST)) {
    const listId = timelineId.slice(ROUTE_TIMELINE_OF_LIST.length)
    return <ListFeedList listId={listId} />
  } else if (timelineId.startsWith(ROUTE_TIMELINE_OF_INBOX)) {
    const id = timelineId.slice(ROUTE_TIMELINE_OF_INBOX.length)
    return <InboxList id={id} />
  }
}
