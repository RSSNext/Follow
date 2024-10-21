import { useCallback } from "react"

import { useModalStack } from "~/components/ui/modal"

import { BoostModalContent } from "./modal"

export const useBoostModal = () => {
  const { present } = useModalStack()

  return useCallback(
    (feedId: string) => {
      present({
        id: "boost",
        title: "Boost",
        content: () => <BoostModalContent feedId={feedId} />,
        overlay: true,
      })
    },
    [present],
  )
}
