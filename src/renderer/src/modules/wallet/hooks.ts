import { useModalStack } from "@renderer/components/ui/modal/stacked/hooks"
import { createElement, useCallback } from "react"
import { toast } from "sonner"

import { TipModalContent } from "./tip-modal"

export const useTipModal = ({ userId, entryId }: { userId?: string, entryId?: string }) => {
  const { present } = useModalStack()

  return useCallback(() => {
    if (!userId) {
      // this should not happen unless there is a bug in the code
      toast.error("You must have a user to tip.")
      return
    }

    present({
      title: "Tip",
      content: () => createElement(TipModalContent, { userId, entryId }),
    })
  }, [present, userId, entryId])
}
