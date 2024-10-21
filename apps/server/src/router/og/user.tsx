import { isBizId } from "@follow/utils/utils"
import * as React from "react"

import type { ApiClient } from "~/lib/api-client"
import { renderToImage } from "~/lib/og/render-to-image"

import { OGCanvas } from "./__base"

export const renderUserOG = async (apiClient: ApiClient, id: string) => {
  const handle = isBizId(id || "") ? id : `${id}`.startsWith("@") ? `${id}`.slice(1) : id

  const user = await apiClient.profiles.$get({
    query: {
      handle,
      id: isBizId(handle || "") ? handle : undefined,
    },
  })

  if (!user) {
    throw 404
  }

  return await renderToImage(
    <OGCanvas seed={user.data.id}>
      <div>Hello</div>
    </OGCanvas>,
    {
      width: 1200,
      height: 600,
    },
  )
}
