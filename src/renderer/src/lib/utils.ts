import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { levels } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(value, min, max) {
  return Math.max(Math.min(max, value), min)
}

export function getEntriesParams({
  level,
  id,
  view,
}: {
  level?: string
  id?: number | string
  view?: number
}) {
  const params: {
    feedId?: string
    feedIdList?: string[]
  } = {}
  if (level === levels.folder) {
    params.feedIdList = `${id}`.split(",")
  } else if (level === levels.feed) {
    params.feedId = `${id}`
  }
  return {
    view,
    ...params,
  }
}
