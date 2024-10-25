import { atom } from "jotai"
import { useCallback } from "react"

import { useAsyncModal } from "~/components/ui/modal/helper/use-async-modal"
import { useI18n } from "~/hooks/common"
import { createAtomHooks } from "~/lib/jotai"

import { BoostModalContent } from "./modal"
import { useBoostStatusQuery } from "./query"

export const useBoostModal = () => {
  const t = useI18n()
  const present = useAsyncModal()

  return useCallback(
    (feedId: string) => {
      const useDataFetcher = () => useBoostStatusQuery(feedId)

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
