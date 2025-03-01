import type { User } from "@auth/core/types"

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
    }),
}
