import type { ExtractAtomValue, PrimitiveAtom } from "jotai"
import { atom, useAtomValue, useSetAtom } from "jotai"
import { createElement, useCallback } from "react"
import { createContext, useContextSelector } from "use-context-selector"

import { PlainModal } from "~/components/ui/modal/stacked/custom-modal"
import { useModalStack } from "~/components/ui/modal/stacked/hooks"

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
        CustomModalComponent: PlainModal,
        modalContainerClassName: "overflow-hidden",
      }),
    [present],
  )
}

interface Ctx {
  canSync: PrimitiveAtom<boolean>
}
export const defaultCtx: Ctx = {
  canSync: atom(true),
}
export const SettingContext = createContext<Ctx>(defaultCtx)

export const useSettingContextSelector = <T>(selector: (state: Ctx) => T) => {
  // @ts-expect-error
  return useAtomValue(useContextSelector(SettingContext, selector)) as ExtractAtomValue<T>
}

export const useSetSettingCanSync = () => {
  const canSync = useContextSelector(SettingContext, (s) => s.canSync)
  return useSetAtom(canSync)
}
