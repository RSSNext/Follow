import { useModalStack } from "@renderer/components/ui/modal/stacked/hooks"
import { NoopChildren } from "@renderer/components/ui/modal/stacked/utils"
import type { ExtractAtomValue, PrimitiveAtom } from "jotai"
import { atom, useAtomValue, useSetAtom } from "jotai"
import { createElement, useCallback } from "react"
import { createContext, useContextSelector } from "use-context-selector"

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
