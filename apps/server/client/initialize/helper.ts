import type { AuthUser } from "@follow/shared/hono"

import { op } from "./op"

export const setIntegrationIdentify = async (user: AuthUser) => {
  op.identify({
    profileId: user.id,
    email: user.email,
    avatar: user.image ?? undefined,
    lastName: user.name,
    properties: {
      handle: user.handle,
      name: user.name,
    },
  })
  await import("@sentry/react").then(({ setTag }) => {
    setTag("user_id", user.id)
    setTag("user_name", user.name)
  })
}
