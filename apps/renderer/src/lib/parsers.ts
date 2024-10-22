import { isTwitterUrl, isXUrl } from "@follow/utils/link-parser"

import type { EntryModel } from "~/models"

export const parseSocialMedia = (entry: EntryModel) => {
  const { authorUrl, url, guid } = entry

  const parsedUrl = authorUrl || url || guid
  const isX = isXUrl(parsedUrl).validate || isTwitterUrl(parsedUrl).validate

  if (isX) {
    return {
      type: "x",
      meta: {
        handle: new URL(parsedUrl).pathname.split("/").pop(),
      },
    }
  }
}
