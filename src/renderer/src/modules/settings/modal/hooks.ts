import { useModalStack } from "@renderer/components/ui/modal/stacked/hooks"
import { NoopChildren } from "@renderer/components/ui/modal/stacked/utils"
import { createElement, useCallback } from "react"

import { SettingModalContent } from "./content"

export const useSettingModal = () => {
  const { present } = useModalStack()

  return useCallback(
    (initialTab?: string) =>
      present({
        title: "Setting",
        id: "setting",
        content: () =>
          createElement(SettingModalContent, {
            initialTab,
          }),
        CustomModalComponent: NoopChildren,
        modalContainerClassName: "overflow-hidden",
      }),
    [present],
  )
}
