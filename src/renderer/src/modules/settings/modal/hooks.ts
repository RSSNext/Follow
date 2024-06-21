import { useModalStack } from "@renderer/components/ui/modal/stacked/hooks"
import { createElement, useCallback } from "react"

import { SettingModalContent } from "./content"

export const useSettingModal = () => {
  const { present } = useModalStack()

  return useCallback(() => present({
    title: "Setting",
    content: SettingModalContent,
    CustomModalComponent: (props) => createElement("div", {
      className: "center h-full center",
    }, props.children),

  }), [present])
}
