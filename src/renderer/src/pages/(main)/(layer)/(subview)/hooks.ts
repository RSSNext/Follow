import { useTitle } from "@renderer/hooks/common"
import { atom, useAtomValue } from "jotai"
import { useHydrateAtoms } from "jotai/utils"

const titleAtom = atom<string | null>(null)
export const useSubViewTitle = (title: string) => {
  useTitle(title)
  useHydrateAtoms([[titleAtom, title]])
}

export const useSubViewTitleValue = () => useAtomValue(titleAtom)
