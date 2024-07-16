import type { UserModel } from "@renderer/database/models/user"

import { useUserStore } from "./store"

export const useUserById = (
  userId: string,
): UserModel | null => useUserStore((state) => state.users[userId])
