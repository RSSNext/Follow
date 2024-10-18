import { createElement, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { useModalStack } from "~/components/ui/modal/stacked/hooks"

import { TipModalContent } from "./tip-modal"

export const useTipModal = ({
  userId,
  feedId,
  entryId,
}: {
  userId?: string
  feedId?: string
  entryId?: string
}) => {
  const { present } = useModalStack()
  const { t } = useTranslation()
  return useCallback(() => {
    if (!feedId || !entryId) {
      // this should not happen unless there is a bug in the code
      toast.error("Invalid feed id or entry id")
      return
    }
    window.analytics?.capture("tip_modal_opened", { entryId })
    present({
      title: t("tip_modal.tip_title"),
      content: () => createElement(TipModalContent, { userId, feedId, entryId }),
    })
  }, [present, userId, feedId, entryId])
}
