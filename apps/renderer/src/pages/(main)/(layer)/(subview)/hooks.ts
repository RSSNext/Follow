import { atom, useAtomValue } from "jotai"
import { useHydrateAtoms } from "jotai/utils"

import { useI18n, useTitle } from "~/hooks/common"

const titleAtom = atom<string | null>(null)
export const useSubViewTitle = (title: I18nKeys) => {
  const t = useI18n()
  useTitle(t(title))
  useHydrateAtoms([[titleAtom, t(title)]])
}

export const useSubViewTitleValue = () => useAtomValue(titleAtom)
