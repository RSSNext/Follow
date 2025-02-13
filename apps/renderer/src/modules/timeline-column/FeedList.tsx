import { withResponsiveSyncComponent } from "@follow/components/utils/selector.js"

import { FeedList as FeedListDesktop } from "./FeedList.desktop"
import { FeedList as FeedListMobile } from "./FeedList.mobile"

export const FeedList = withResponsiveSyncComponent(FeedListDesktop, FeedListMobile)
