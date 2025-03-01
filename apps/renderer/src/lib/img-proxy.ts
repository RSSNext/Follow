import { replaceImgUrlIfNeed as replaceImgUrlIfNeedUtils } from "@follow/utils/img-proxy"

import { isWebBuild } from "~/constants"

export const replaceImgUrlIfNeed = (url?: string) => {
  return replaceImgUrlIfNeedUtils({
    url,
    inBrowser: isWebBuild,
  })
}
