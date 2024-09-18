import type { EntryModel } from "~/models"

import { isTwitterUrl, isXUrl } from "./link-parser"

export const parseSocialMedia = (entry: EntryModel) => {
  const { authorUrl, url, guid } = entry

  const parsedUrl = authorUrl || url || guid
  const isX = isXUrl(parsedUrl) || isTwitterUrl(parsedUrl)

  if (isX) {
    return {
      type: "x",
      meta: {
        handle: new URL(parsedUrl).pathname.split("/").pop(),
      },
    }
  }
}
