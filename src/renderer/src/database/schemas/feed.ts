import { z } from "zod"

export const DB_FeedIdSchema = z.object({
  feedId: z.string(),
})

export type DB_FeedId = z.infer<typeof DB_FeedIdSchema>
