import type { UserModel } from "@follow/models"

import { op } from "./op"

export const setIntegrationIdentify = async (user: UserModel) => {
  op.identify({
    profileId: user.id,
    email: user.email,
    avatar: user.image ?? undefined,
    lastName: user.name ?? undefined,
    properties: {
      handle: user.handle,
      name: user.name,
    },
  })
  op.track("identify", {
    user_id: user.id,
  })
  await import("@sentry/react").then(({ setTag }) => {
    setTag("user_id", user.id)
    setTag("user_name", user.name)
  })
}
