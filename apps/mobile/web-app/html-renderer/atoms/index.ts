import { atom } from "jotai"

import type { EntryModel } from "../types"

export const entryAtom = atom<EntryModel | null>(null)
