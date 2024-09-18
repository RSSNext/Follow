import { atom } from "jotai"

import { createAtomHooks } from "~/lib/jotai"

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

export enum ReadabilityStatus {
  INITIAL = 1,
  WAITING = 2,
  SUCCESS = 3,
  FAILURE = 4,
}
export const [
  ,
  ,
  useReadabilityStatus,
  ,
  getReadabilityStatus,
  __setReadabilityStatus,
  useReadabilityStatusSelector,
] = createAtomHooks(atom<Record<string, ReadabilityStatus>>({}))
export const setReadabilityStatus = mergeObjectSetter(__setReadabilityStatus, getReadabilityStatus)

export const useEntryIsInReadability = (entryId?: string) =>
  useReadabilityStatusSelector(
    (map) => (entryId ? (map[entryId] ? isInReadability(map[entryId]) : false) : false),
    [entryId],
  )

export const useEntryInReadabilityStatus = (entryId?: string) =>
  useReadabilityStatusSelector(
    (map) => (entryId ? map[entryId] || ReadabilityStatus.INITIAL : ReadabilityStatus.INITIAL),
    [entryId],
  )

export const isInReadability = (status: ReadabilityStatus) =>
  status !== ReadabilityStatus.INITIAL && !!status
export const useEntryReadabilityContent = (entryId: string) =>
  useReadabilityContentSelector((map) => map[entryId], [entryId])
