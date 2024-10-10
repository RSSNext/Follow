import { t } from "i18next"
import { useCallback } from "react"

import { useModalStack } from "~/components/ui/modal"
import { SlideUpModal } from "~/components/ui/modal/stacked/custom-modal"

import { PowerModalContent } from "./PowerModalContent"

export const usePowerModal = () => {
  const { present } = useModalStack()

  return useCallback(() => {
    return present({
      title: t("settings:titles.power"),
      content: () => <PowerModalContent />,
      CustomModalComponent: SlideUpModal.class(tw`aspect-[7/8]`),
    })
  }, [present])
}
