import type { UserModel } from "@renderer/models"

import { useUserStore } from "./store"

export const useUserById = (
  userId: string,
): UserModel | null => useUserStore((state) => state.users[userId])
