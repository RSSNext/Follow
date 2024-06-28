import { z } from "zod"

export const DB_EntrySchema = z.object({
  id: z.string(),
})

export type DB_Entry = z.infer<typeof DB_EntrySchema>
