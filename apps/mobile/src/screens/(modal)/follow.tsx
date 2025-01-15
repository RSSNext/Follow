import { useLocalSearchParams } from "expo-router"

import { FollowFeed } from "@/src/modules/feed/FollowFeed"
import { FollowList } from "@/src/modules/list/FollowList"

export default function Follow() {
  const { id, type = "feed" } = useLocalSearchParams()

  switch (type) {
    case "feed": {
      return <FollowFeed id={id as string} />
    }
    case "list": {
      return <FollowList id={id as string} />
    }
    default: {
      return <FollowFeed id={id as string} />
    }
  }
}
