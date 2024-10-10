import { atom, useAtomValue } from "jotai"
import { useHydrateAtoms } from "jotai/utils"
import type { ReactNode } from "react"

import { useI18n, useTitle } from "~/hooks/common"

const titleAtom = atom<string | ReactNode | null>(null)

export function useSubViewTitle(title: I18nKeys): void
export function useSubViewTitle(title: ReactNode, fallbackTitleString: string): void

export function useSubViewTitle(title: I18nKeys | ReactNode, fallbackTitleString?: string) {
  const t = useI18n()
  useTitle(typeof title === "string" ? t(title as I18nKeys) : fallbackTitleString)
  useHydrateAtoms([[titleAtom, typeof title === "string" ? t(title as I18nKeys) : title]])
}

export const useSubViewTitleValue = () => useAtomValue(titleAtom)
