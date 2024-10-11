import { useCallback } from "react"

import { useModalStack } from "~/components/ui/modal"
import { SlideUpModal } from "~/components/ui/modal/stacked/custom-modal"

import { AchievementModalContent } from "./AchievementModalContent"

export const useAchievementModal = () => {
  const { present } = useModalStack()

  return useCallback(() => {
    present({
      id: "achievement",
      title: "Achievements",
      content: AchievementModalContent,
      CustomModalComponent: SlideUpModal,
      overlay: true,
    })
  }, [present])
}
