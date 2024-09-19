import type { UserModel } from "~/models"

import { useUserStore } from "./store"

export const useUserById = (userId: string): UserModel | null =>
  useUserStore((state) => state.users[userId])
