import { createAtomHooks } from "@follow/utils/jotai"
import { atom } from "jotai"

export const [, , useMasonryColumnValue, , getMasonryColumnValue, setMasonryColumnValue] =
  createAtomHooks(atom(-1))
