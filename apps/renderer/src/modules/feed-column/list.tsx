import { withResponsiveSyncComponent } from "@follow/components/utils/selector.js"

import { FeedList as FeedListDesktop } from "./list.desktop"
import { FeedList as FeedListMobile } from "./list.mobile"

export const FeedList = withResponsiveSyncComponent(FeedListDesktop, FeedListMobile)
