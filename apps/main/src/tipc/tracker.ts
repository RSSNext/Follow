import type { User } from "@auth/core/types"

import { posthog } from "../lib/posthog"
import { setUser } from "../lib/user"
import { t } from "./_instance"

export const trackerRoute = {
  trackerIdentify: t.procedure
    .input<{
      user: User
    }>()
    .action(async ({ input }) => {
      const { user } = input

      setUser(user)
      posthog?.capture({
        event: "login",
        distinctId: user.id ?? "",
        properties: {
          name: user.name,
          handle: user.handle ?? "",
        },
      })
    }),
}
