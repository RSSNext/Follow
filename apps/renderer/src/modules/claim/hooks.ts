import { createElement, useCallback } from "react"

import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { getFeedById } from "~/store/feed"

import { FeedClaimModalContent } from "./feed-claim-modal"

export const useFeedClaimModal = ({ feedId }: { feedId?: string }) => {
  const { present } = useModalStack()

  return useCallback(() => {
    if (!feedId) return

    const feed = getFeedById(feedId)

    if (!feed) return

    present({
      title: "Feed Claim",
      content: () => createElement(FeedClaimModalContent, { feedId }),
      modalClassName: "!h-auto !max-h-screen",
    })
  }, [feedId, present])
}
