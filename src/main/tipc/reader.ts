import { readability } from "../lib/readability"
import { t } from "./_instance"

export const readerRoute = {
  readability: t.procedure
    .input<{ url: string }>()
    .action(async ({ input }) => {
      const { url } = input

      if (!url) {
        return null
      }
      const result = await readability(url)

      return result
    }),
}
