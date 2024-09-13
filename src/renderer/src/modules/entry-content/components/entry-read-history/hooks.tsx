import { useModalStack } from "@renderer/components/ui/modal"
import { NoopChildren } from "@renderer/components/ui/modal/stacked/utils"
import { createElement, useCallback } from "react"
import { toast } from "sonner"

import { EntryReadHistoryModalContent } from "./modal-content"

export const useEntryReadHistoryModal = ({ entryId }: { entryId?: string }) => {
  const { present } = useModalStack()

  return useCallback(() => {
    if (!entryId) {
      toast.error("Invalid feed id or entry id")
      return
    }
    present({
      title: "Entry Read History",
      content: () => createElement(EntryReadHistoryModalContent, { entryId }),
      CustomModalComponent: NoopChildren,
      modal: true,
      overlay: true,
      clickOutsideToDismiss: true,
    })
  }, [present, entryId])
}
