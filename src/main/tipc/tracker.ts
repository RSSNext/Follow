import type { User } from "@auth/core/types"

import { posthog } from "../posthog"
import { t } from "./_instance"

export const trackerRoute = {
  trackerIdentify: t.procedure
    .input<{
      user: User
    }>()
    .action(async ({ input }) => {
      const { user } = input

      posthog?.identify(user.id, {
        name: user.name,
        handle: user.handle,
      })
    }),
}
