import { createAtomHooks } from "@renderer/lib/jotai"
import { atom } from "jotai"

type Readability = {
  title: string
  content: string
  textContent: string
  length: number
  excerpt: string
  byline: string
  dir: string
  siteName: string
  lang: string
  publishedTime: string
}

const mergeObjectSetter =
  <T>(setter: (prev: T) => void, getter: () => T) =>
    (value: Partial<T>) =>
      setter({ ...getter(), ...value })

export const [
  ,
  ,
  useReadabilityContent,
  ,
  getReadabilityContent,
  __setReadabilityContent,
  useReadabilityContentSelector,
] = createAtomHooks(atom<Record<string, Readability>>({}))
export const setReadabilityContent = mergeObjectSetter(
  __setReadabilityContent,
  getReadabilityContent,
)

export const [
  ,
  ,
  useReadabilityStatus,
  ,
  getReadabilityStatus,
  __setReadabilityStatus,
  useReadabilityStatusSelector,
] = createAtomHooks(atom<Record<string, boolean>>({}))
export const setReadabilityStatus = mergeObjectSetter(
  __setReadabilityStatus,
  getReadabilityStatus,
)

export const useEntryIsInReadability = (entryId?: string) =>
  useReadabilityStatusSelector((map) => (entryId ? map[entryId] : false))
export const useEntryReadabilityContent = (entryId: string) =>
  useReadabilityContentSelector((map) => map[entryId])
