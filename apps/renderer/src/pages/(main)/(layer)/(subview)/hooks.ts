import { atom, useAtomValue } from "jotai"
import { useHydrateAtoms } from "jotai/utils"

import { useTitle } from "~/hooks/common"

const titleAtom = atom<I18nKeys | null>(null)
export const useSubViewTitle = (title: I18nKeys) => {
  useTitle(title)
  useHydrateAtoms([[titleAtom, title]])
}

export const useSubViewTitleValue = () => useAtomValue(titleAtom)
