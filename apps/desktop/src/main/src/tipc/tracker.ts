import type { UserModel } from "@follow/models"

import { setUser } from "../lib/user"
import { t } from "./_instance"

export const trackerRoute = {
  trackerIdentify: t.procedure
    .input<{
      user: UserModel
    }>()
    .action(async ({ input }) => {
      const { user } = input

      setUser(user)
    }),
}
