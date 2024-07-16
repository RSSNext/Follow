import type { users } from "@renderer/hono"

export type UserModel = Omit<typeof users.$inferSelect, "emailVerified">
