import { useModalStack } from "@renderer/components/ui/modal/stacked/hooks"
import { createElement, useCallback } from "react"
import { toast } from "sonner"

import { TipModalContent } from "./tip-modal"

export const useTipModal = ({ userId, feedId }: { userId?: string, feedId?: string }) => {
  const { present } = useModalStack()

  return useCallback(() => {
    if (!userId && !feedId) {
      // this should not happen unless there is a bug in the code
      toast.error("Invalid user id or feed id")
      return
    }

    present({
      title: "Tip Power",
      content: () => createElement(TipModalContent, { userId, feedId }),
    })
  }, [present, userId, feedId])
}
