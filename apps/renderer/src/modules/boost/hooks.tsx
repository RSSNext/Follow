import { atom } from "jotai"
import { useCallback } from "react"

import { useAsyncModal } from "~/components/ui/modal/helper/use-async-modal"
import { useAuthQuery, useI18n } from "~/hooks/common"
import { createAtomHooks } from "~/lib/jotai"
import { boosts } from "~/queries/boosts"

import { BoostModalContent } from "./modal"

export const useBoostModal = () => {
  const t = useI18n()
  const present = useAsyncModal()

  return useCallback(
    (feedId: string) => {
      const useDataFetcher = () => useAuthQuery(boosts.getStatus({ feedId }))

      type ResponseType = Awaited<ReturnType<ReturnType<typeof useDataFetcher>["fn"]>>

      present<ResponseType>({
        id: "boost",
        title: t("words.boost"),
        content: () => <BoostModalContent feedId={feedId} />,
        overlay: true,
        useDataFetcher,
        clickOutsideToDismiss: true,
      })
    },
    [present, t],
  )
}

const [, , useFeedBoostMap, , getFeedBoostMap, setFeedBoostMap] = createAtomHooks(
  atom<Record<string, boolean>>({}),
)

export const updateFeedBoostStatus = (feedId: string, isBoosted: boolean) => {
  const prev = getFeedBoostMap()
  setFeedBoostMap({ ...prev, [feedId]: isBoosted })
}

export const useIsFeedBoosted = (feedId: string) => {
  const map = useFeedBoostMap()
  return map[feedId] ?? false
}
