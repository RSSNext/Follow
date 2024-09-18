import { useTitle } from "@renderer/hooks/common"
import { atom, useAtomValue } from "jotai"
import { useHydrateAtoms } from "jotai/utils"

const titleAtom = atom<I18nKeys | null>(null)
export const useSubViewTitle = (title: I18nKeys) => {
  useTitle(title)
  useHydrateAtoms([[titleAtom, title]])
}

export const useSubViewTitleValue = () => useAtomValue(titleAtom)
