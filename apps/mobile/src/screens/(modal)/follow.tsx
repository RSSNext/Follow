import { useLocalSearchParams } from "expo-router"

import { FollowFeed, FollowUrl } from "@/src/modules/feed/FollowFeed"
import { FollowList } from "@/src/modules/list/FollowList"

export default function Follow() {
  const { id, type = "feed", url } = useLocalSearchParams()

  switch (type) {
    case "feed": {
      return <FollowFeed id={id as string} />
    }
    case "list": {
      return <FollowList id={id as string} />
    }
    case "url": {
      return <FollowUrl url={url as string} />
    }
    default: {
      return <FollowFeed id={id as string} />
    }
  }
}
